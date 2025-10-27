import {
  AfterViewInit,
  Component,
  computed,
  inject,
  PLATFORM_ID, Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {GeocoderAutocomplete} from '../../shared/geocoder-autocomplete/geocoder-autocomplete';
import {Map, Icon, map, tileLayer, marker, Marker, latLng, LeafletEvent, LeafletMouseEvent} from 'leaflet';
import {isPlatformBrowser} from '@angular/common';
import {Localization} from '../../../core/models/Localization';
import {GeoapifyService} from '../../../core/services/geoapify-service/geoapify.service';
import {LatLenPayloadDTO} from '../../../core/models/LatLenPayloadDTO';
import {EditableText} from '../../shared/editable-text/editable-text';
import {ValidatorFn, Validators} from '@angular/forms';
import {passwordValidator} from '../login-register/login-register';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-profile-page',
  imports: [
    GeocoderAutocomplete,
    EditableText,
    TranslatePipe

  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements AfterViewInit {
  private _map! : Map;
  private readonly _mapEl = 'map';
  private _currentMarker : WritableSignal<Marker | undefined> = signal(undefined);

  private _userName  = signal("Dawid Pacia");
  private _email = signal("robert@kozyra.pl");
  private _phone = signal("+48 233 122 423");
  private _localization = signal<Localization | null> (null);
  private _tempLocalization = signal<Localization | null> (null);

  userName: Signal<string> = this._userName;
  email: Signal<string> = this._email;
  phone: Signal<string> = computed(() =>
    this._phone() == "" ? "----" : this._phone()
  );

  localization:Signal<string> = computed(() => {
    if (this.editLocalization()) {
      return this._tempLocalization()?.formatted ?? "----";
    }
    return this._localization()?.formatted ?? "----";
  });
  displayUnsavedLocalization:Signal<boolean> = computed(() => {
    if(!this.editLocalization()) return false;
    return this._tempLocalization() !== this._localization();
  });
  tempLocIsValid:Signal<boolean> = computed(() => {
    return this.ValidateLocalization(this._tempLocalization());
  })

  phoneNumber = computed(() =>
    this._phone() === "" ? "----" : this._phone() );

  // Edit switches
  private _editLocalization = signal(false);
  editLocalization: Signal<boolean> = this._editLocalization;
  private _editPassword = signal(false);
  editPassword: Signal<boolean> = this._editPassword;

  // Field updating
  UpdateEmail(email: string): void {
    this._email.set(email);
  }
  UpdateUsername(name: string): void {
    this._userName.set(name);
  }
  UpdatePhone(phone: string): void {
    this._phone.set(phone);
  }
  UpdateLocalization() {
    if(this._tempLocalization() === this._localization()) return;
    if(this._tempLocalization() == null) return;
    this._localization.set(this._tempLocalization());
    this.SwitchLocalizationEdition();
  }
  UpdateTempLocalization(newLoc: Localization | null) {
    if(newLoc == null) return;
    this._tempLocalization.set(newLoc);
    this.FlyTo(newLoc.lat, newLoc.lon, newLoc.city);
  }


  // Validators
  readonly emailValidators: ValidatorFn | ValidatorFn[] = [
    Validators.email,
    Validators.required
  ];
  readonly phoneValidators: ValidatorFn | ValidatorFn[] = [
    Validators.pattern(RegExp("\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*(\\d{1,2})$")),
    Validators.maxLength(20)
  ];
  readonly usernameValidators: ValidatorFn | ValidatorFn[] = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ];

  //////////////////
  // Map handling //
  //////////////////

  // while app has server-side rendering, leaflet uses client-side.
  // We need to handle this properly.
  private _platformId = inject(PLATFORM_ID);

  SwitchLocalizationEdition() {
    this._editLocalization.set(!this._editLocalization());
    this.AllowMapControl(this.editLocalization());
    if(this.editLocalization()) {
      this._tempLocalization.set(this._localization());
    }
  }

  private ClearMarker() {
    if(this._currentMarker() && isPlatformBrowser(this._platformId)) {
      this._currentMarker()?.closePopup().unbindPopup().remove();
      this._currentMarker()?.remove();
      this._currentMarker.set(undefined);
    }
  }

  private ResetMarkerToCurrentLocalization() {
    if(this.ValidateLocalization(this._localization())) {
      // _localization must have valid values as it passed validation
      //    so it is safe to use this._localization()!
      this.FlyTo(
        this._localization()!.lat,
        this._localization()!.lon,
        this._localization()!.city
      )
      return;
    }
    // If localization is not set
    if(this._currentMarker()) {
      this._map?.flyTo(this._currentMarker()?.getLatLng() ?? [50.2970546, 18.6926949],
        13);
    }
  }

  private AllowMapControl(allow: boolean) {
    if(allow) {
      this._map?.boxZoom?.enable();
      this._map?.scrollWheelZoom?.enable();
      this._map?.touchZoom?.enable();
      this._map?.dragging?.enable();
      this._map?.doubleClickZoom?.enable();
      this._map?.setZoomAround(this._currentMarker()?.getLatLng() ?? [50.2970546, 18.6926949],
        10);
      return;
    }
    this.ResetMarkerToCurrentLocalization();
    this._map?.doubleClickZoom?.disable();
    this._map?.boxZoom?.disable();
    this._map?.scrollWheelZoom?.disable();
    this._map?.touchZoom?.disable();
    this._map?.dragging?.disable();
  }

  async FlyTo(lat: number, lon: number, city: string) {
    if (isPlatformBrowser(this._platformId)) {
      const { marker } = await import('leaflet');
      this._map = this._map.flyTo([lat, lon], 13);
      this.ClearMarker();
      this._currentMarker.set(marker([lat, lon]).addTo(this._map).bindPopup(city).openPopup());
    }
  }

  async InitMap(lat:number, lng:number, city:string) {
    this.ClearMarker();
    if (isPlatformBrowser(this._platformId)) {
      const { map, tileLayer, marker, Icon } = await import('leaflet');

      Icon.Default.prototype.options.iconRetinaUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowSize = [25, 41];

      this._map = map(this._mapEl).setView([lat,lng], 13);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this._map);
      this._currentMarker.set(marker([lat, lng]).addTo(this._map).bindPopup(city).openPopup());

      this._map.on('click', ((e) => {
        if(!this.editLocalization()) return;
        this.GetPlace(e.latlng.lat, e.latlng.lng);
      }));
      this.AllowMapControl(false);
    }

  }

  constructor(private geoapify: GeoapifyService) {
  }

  private ValidateLocalization(loc : Localization | null) : boolean {
    if(loc == null) return false;
    if(!loc.city) return false;
    if(!loc.state) return false;
    return loc.country != undefined;
  }

  GetPlace(lat :number, lng:number) {
    const request : LatLenPayloadDTO = {
      lat: lat,
      lng: lng,
      filter: "city"
    }
    this.geoapify.ReverseCeocode(request).subscribe({
      next: (response) => {
        if(this.ValidateLocalization(response)) {
          this._tempLocalization.set(response);
          this.FlyTo(response.lat, response.lon, response.city);
        }
      },
      error: (err) => {
        console.error('Error fetching autocomplete suggestions:', err);
      }
    });
  }

  async ngAfterViewInit() {
   await this.InitMap(50.2970546, 18.6926949, "Gliwice");
  }
}
