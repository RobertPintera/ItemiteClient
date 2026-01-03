import {
  Component,
  computed,
  inject, OnInit,
  PLATFORM_ID, Signal, SecurityContext,
  signal,
  WritableSignal, effect, input
} from '@angular/core';
import {GeocoderAutocomplete} from '../../shared/geocoder-autocomplete/geocoder-autocomplete';
import {Map, Marker} from 'leaflet';
import {isPlatformBrowser} from '@angular/common';
import {Localization} from '../../../core/models/location/Localization';
import {GeoapifyService} from '../../../core/services/geoapify-service/geoapify.service';
import {EditableText} from '../../shared/editable-text/editable-text';
import {FormsModule, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ConfirmDialog} from '../../shared/confirm-dialog/confirm-dialog';
import {FileUpload} from '../../shared/file-upload/file-upload';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AuthService} from '../../../core/services/auth-service/auth.service';
import {Router, RouterLink} from '@angular/router';
import {LoadingCircle} from '../../shared/loading-circle/loading-circle';
import {Button} from '../../shared/button/button';
import {UserService} from '../../../core/services/user-service/user.service';

@Component({
  selector: 'app-user-page',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    LoadingCircle,
    FormsModule,
  ],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css'
})
export class UserPage implements OnInit {
  // region Injectables
  private _geoapify: GeoapifyService = inject(GeoapifyService);
  private _sanitizer: DomSanitizer = inject(DomSanitizer);
  private _userService: UserService = inject(UserService);
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  // endregion

  userId = input.required<number>();

  // region Leaflet map utilities
  private _map! : Map;
  private readonly _mapEl = 'map';
  private _currentMarker : WritableSignal<Marker | undefined> = signal(undefined);
  // endregion

  // region private user fields
  // local images are undefined when they haven't been changed with file dialogs
  private _backgroundImageUrl:WritableSignal<string | undefined> = signal(undefined);
  private _profileImageUrl:WritableSignal<string | undefined> = signal(undefined);
  private _userName  = signal("");
  private _email = signal("");
  private _phone = signal<undefined | string>(undefined);
  private _localization = signal<Localization | null> (null);
  // endregion

  // region utility layout handling
  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();
  // endregion

  // region readonly user fields
  readonly profileImage:Signal<string> = computed(() => {
    if(this._profileImageUrl()) {
      return this._profileImageUrl()!;
    }
    return "../../../../assets/images/default_profile_pic.png";
  });
  readonly backgroundImage: Signal<string> = computed(() => {
    return this._backgroundImageUrl()!;
  });
  readonly hasBackgroundImage: Signal<boolean> = computed(() => !!this._backgroundImageUrl());
  readonly userName: Signal<string> = this._userName.asReadonly();
  readonly email: Signal<string> = this._email.asReadonly();
  readonly phone: Signal<string> = computed(() =>
    this._phone() ?? "----"
  );
  readonly localization:Signal<string> = computed(() => {
    return this._localization()?.formatted ?? "----";
  });
  readonly phoneNumber = computed(() =>
    this._phone() === "" ? "----" : this._phone() );
  // endregion

  async ngOnInit() {
    if(!isPlatformBrowser(this._platformId)) return;
    this.LoadUserInfo();
  }

  constructor() {
    effect(() => {
      if(!this.loading() && this._map === undefined) {
        this.InitMap(50.2970546, 18.6926949, "Gliwice");
      }
    });
  }

  LoadUserInfo() {
    this._userService.GetUser(this.userId()).subscribe({
      next: user => {
        const location = user.location;
        this._userName.set(user.userName);
        this._email.set(user.email);
        this._phone.set(user.phoneNumber);
        this._profileImageUrl.set(user.photoUrl);
        this._backgroundImageUrl.set(user.backgroundUrl);
        this._loading.set(false);

        if (!location) return;

        this._localization.set({
          city: location.city,
          country: location.country,
          formatted: `${location.city}, ${location.state}, ${location.country}`,
          latitude: location.latitude,
          longitude: location.longitude,
          state: location.state,
        });
      }
    });
  }

  //////////////////
  // Map handling //
  //////////////////

  // While app has server-side rendering, leaflet uses client-side.
  //    We need to handle this properly.
  private _platformId = inject(PLATFORM_ID);

  private ClearMarker() {
    if(this._currentMarker() && isPlatformBrowser(this._platformId)) {
      this._currentMarker()?.closePopup().unbindPopup().remove();
      this._currentMarker()?.remove();
      this._currentMarker.set(undefined);
    }
  }

  private ResetMarkerToCurrentLocalization() {
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
      this.AllowMapControl(false);
    }
  }
}
