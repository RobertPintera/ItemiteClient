import {AfterViewInit, Component, inject, model, PLATFORM_ID, signal} from '@angular/core';
import {GeocoderAutocomplete} from "../geocoder-autocomplete/geocoder-autocomplete";
import {isPlatformBrowser} from '@angular/common';
import {Localization} from '../../../core/models/Localization';
import {Marker, Map} from 'leaflet';
import {LatLonPayloadDTO} from '../../../core/models/LatLonPayloadDTO';
import {GeoapifyService} from '../../../core/services/geoapify-service/geoapify.service';
import {Button} from '../button/button';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-geo-map-autocomplete',
  imports: [
    GeocoderAutocomplete,
    Button,
    TranslatePipe
  ],
  templateUrl: './geo-map-autocomplete.html',
  styleUrl: './geo-map-autocomplete.css'
})
export class GeoMapAutocomplete implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private geoapifyService = inject(GeoapifyService);

  private map!: Map;

  readonly currentLocalization = model<Localization | null>(null);

  readonly currentMarker = signal<Marker | undefined>(undefined);
  readonly tempLocalization = model<Localization | null>(null);
  readonly isEdit = signal<boolean>(false);

  async ngAfterViewInit() {
    await this.initMap(50.2970546, 18.6926949, "Gliwice");
  }

  updateLocalization(localization: Localization | null): void {
    if(localization == null) return;
    this.tempLocalization.set(localization);
    this.flyTo(localization.latitude, localization.longitude, localization.city);
  }

  cancel(){
    this.isEdit.set(false);
    this.tempLocalization.set(this.currentLocalization());
    this.allowMapControl(this.isEdit());
  }

  edit(){
    this.isEdit.set(true);
    this.currentLocalization.set(this.tempLocalization());
    this.allowMapControl(this.isEdit());
  }

  save() {
    this.isEdit.set(false);
    this.currentLocalization.set(this.tempLocalization());
    this.allowMapControl(this.isEdit());
  }

  private clearMarker() {
    if(this.currentMarker() && isPlatformBrowser(this.platformId)) {
      this.currentMarker()?.closePopup().unbindPopup().remove();
      this.currentMarker()?.remove();
      this.currentMarker.set(undefined);
    }
  }

  private async flyTo(lat: number, lon: number, city: string) {
    if (isPlatformBrowser(this.platformId)) {
      const { marker } = await import('leaflet');
      this.map = this.map.flyTo([lat, lon], 13);
      this.clearMarker();
      this.currentMarker.set(marker([lat, lon]).addTo(this.map).bindPopup(city).openPopup());
    }
  }

  private async initMap(latitude: number, longtitude: number, city: string) {
    this.clearMarker();
    if(isPlatformBrowser(this.platformId)) {
      const { map, tileLayer, marker, Icon } = await import('leaflet');

      Icon.Default.prototype.options.iconRetinaUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowSize = [25, 41];

      const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      this.map = map('map').setView([latitude, longtitude], 14);
      tileLayer(baseMapURl, {attribution: '&copy; OpenStreetMap contributors'}).addTo(this.map);

      this.map.on('click', ((e) => {
        if(!this.isEdit()) return;
        this.getPlace(e.latlng.lat, e.latlng.lng);
      }));

      this.allowMapControl(false);
    }
  }

  private getPlace(lat :number, lng:number) {
    const request: LatLonPayloadDTO = {
      latitude: lat,
      longitude: lng,
      filter: "city"
    };
    this.geoapifyService.ReverseGeocode(request).subscribe({
      next: (response) => {
        if(this.validateLocalization(response)) {
          this.tempLocalization.set(response);
          this.flyTo(response.latitude, response.longitude, response.city);
        }
      },
      error: (err) => {
        console.error('Error fetching autocomplete suggestions:', err);
      }
    });
  }

  private validateLocalization(loc : Localization | null) : boolean {
    if(loc == null) return false;
    if(!loc.city) return false;
    if(!loc.state) return false;
    return loc.country != undefined;
  }

  private allowMapControl(allow: boolean) {
    if(allow) {
      this.map?.boxZoom?.enable();
      this.map?.scrollWheelZoom?.enable();
      this.map?.touchZoom?.enable();
      this.map?.dragging?.enable();
      this.map?.doubleClickZoom?.enable();
      this.map?.setZoomAround(this.currentMarker()?.getLatLng() ?? [50.2970546, 18.6926949],
        10);
      return;
    }
    this.resetMarkerToCurrentLocalization();
    this.map?.doubleClickZoom?.disable();
    this.map?.boxZoom?.disable();
    this.map?.scrollWheelZoom?.disable();
    this.map?.touchZoom?.disable();
    this.map?.dragging?.disable();
  }

  private resetMarkerToCurrentLocalization() {
    if(!this.validateLocalization(this.tempLocalization())) {
      this.clearMarker();
      return;
    }

    const loc = this.tempLocalization()!;
    if(loc)
      this.flyTo(loc.latitude, loc.longitude, loc.city);
  }
}
