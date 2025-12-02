import {AfterViewInit, Component, effect, inject, model, PLATFORM_ID, signal} from '@angular/core';
import {GeocoderAutocomplete} from "../geocoder-autocomplete/geocoder-autocomplete";
import {isPlatformBrowser} from '@angular/common';
import {Localization} from '../../../core/models/Localization';
import {Marker, Map} from 'leaflet';
import {LatLonPayloadDTO} from '../../../core/models/LatLonPayloadDTO';
import {GeoapifyService} from '../../../core/services/geoapify-service/geoapify.service';
import {Button} from '../button/button';
import {TranslatePipe} from '@ngx-translate/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

@Component({
  selector: 'app-geo-map-autocomplete',
  imports: [
    GeocoderAutocomplete,
    Button,
    TranslatePipe
  ],
  templateUrl: './geo-map-autocomplete.html',
  styleUrl: './geo-map-autocomplete.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: GeoMapAutocomplete,
      multi: true
    }
  ]
})
export class GeoMapAutocomplete implements AfterViewInit, ControlValueAccessor {
  private platformId = inject(PLATFORM_ID);
  private geoapifyService = inject(GeoapifyService);
  private _map!: Map;
  private _isInitialized = false;

  private onChange: (value: Localization | null) => void = () => {};
  private onTouched: () => void = () => {};

  readonly currentLocalization = model<Localization | null>(null);

  readonly tempLocalization = model<Localization | null>(null);

  readonly currentMarker = signal<Marker | undefined>(undefined);
  readonly isDisabled = signal<boolean>(false);
  readonly isEdit = signal<boolean>(false);
  readonly isMapReady = signal<boolean>(false);

  async ngAfterViewInit() {
    await this.initMap(50.2970546, 18.6926949);
    this.isMapReady.set(true);
  }

  constructor() {
    effect(() => {
      const loc = this.currentLocalization();
      const mapReady = this.isMapReady();

      if (!(loc && mapReady && !this._isInitialized && this.validateLocalization(loc))) return;

      this._isInitialized = true;
      this.tempLocalization.set(this.currentLocalization());
      void this.flyTo(loc.latitude, loc.longitude, loc.city);
    });
  }

  updateLocalization(localization: Localization | null): void {
    if(localization == null) return;
    this.tempLocalization.set(localization);
    void this.flyTo(localization.latitude, localization.longitude, localization.city);
  }

  cancel(){
    this.isEdit.set(false);
    this.tempLocalization.set(this.currentLocalization());
    this.allowMapControl(this.isEdit());
    this.onChange(this.currentLocalization());
    this.onTouched();
  }

  edit(){
    this.isEdit.set(true);
    this.currentLocalization.set(this.tempLocalization());
    this.allowMapControl(this.isEdit());
    this.onChange(this.currentLocalization());
    this.onTouched();
  }

  save() {
    this.isEdit.set(false);
    this.currentLocalization.set(this.tempLocalization());
    this.allowMapControl(this.isEdit());
    this.onChange(this.currentLocalization());
    this.onTouched();
  }

  // ------ forms -----
  writeValue(obj: Localization | null): void {
    this.currentLocalization.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
  // -------------------

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
      this._map.flyTo([lat, lon], 13);
      this.clearMarker();
      this.currentMarker.set(marker([lat, lon]).addTo(this._map).bindPopup(city).openPopup());
    }
  }

  private async initMap(latitude: number, longitude: number) {
    this.clearMarker();

    if (!isPlatformBrowser(this.platformId)) return;

    const { map, tileLayer, Icon } = await import('leaflet');

    if (!this._map) {
      Icon.Default.prototype.options.iconRetinaUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowSize = [25, 41];

      const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      this._map = map('map').setView([latitude, longitude], 14);
      tileLayer(baseMapURl, { attribution: '&copy; OpenStreetMap contributors' }).addTo(this._map);

      this._map.on('click', (e) => {
        if (!this.isEdit()) return;
        this.getPlace(e.latlng.lat, e.latlng.lng);
      });

      this.allowMapControl(false);
    } else {
      this._map.setView([latitude, longitude], 14);
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
      this._map?.boxZoom?.enable();
      this._map?.scrollWheelZoom?.enable();
      this._map?.touchZoom?.enable();
      this._map?.dragging?.enable();
      this._map?.doubleClickZoom?.enable();
      this._map?.setZoomAround(this.currentMarker()?.getLatLng() ?? [50.2970546, 18.6926949],
        10);
      return;
    }
    this.resetMarkerToCurrentLocalization();
    this._map?.doubleClickZoom?.disable();
    this._map?.boxZoom?.disable();
    this._map?.scrollWheelZoom?.disable();
    this._map?.touchZoom?.disable();
    this._map?.dragging?.disable();
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
