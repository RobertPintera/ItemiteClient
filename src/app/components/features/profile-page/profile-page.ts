import {
  AfterViewInit,
  Component,
  computed,
  inject, OnInit,
  PLATFORM_ID, Signal, SecurityContext,
  signal,
  WritableSignal
} from '@angular/core';
import {GeocoderAutocomplete} from '../../shared/geocoder-autocomplete/geocoder-autocomplete';
import {Map, Marker} from 'leaflet';
import {isPlatformBrowser} from '@angular/common';
import {Localization} from '../../../core/models/Localization';
import {GeoapifyService} from '../../../core/services/geoapify-service/geoapify.service';
import {LatLonPayloadDTO} from '../../../core/models/LatLonPayloadDTO';
import {EditableText} from '../../shared/editable-text/editable-text';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ScaledText} from '../../shared/scaled-text/scaled-text';
import {PasswordValidator, UpdatePasswordErrors} from '../../../core/Utility/Validation';
import {ConfirmDialog} from '../../shared/confirm-dialog/confirm-dialog';
import {FileUpload} from '../../shared/file-upload/file-upload';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {UserService} from '../../../core/services/user-service/user.service';
import {Router} from '@angular/router';
import {LoadingCircle} from '../../shared/loading-circle/loading-circle';
import {EditEmail} from './edit-email/edit-email';
import {EditPassword} from './edit-password/edit-password.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    GeocoderAutocomplete,
    EditableText,
    TranslatePipe,
    ReactiveFormsModule,
    ConfirmDialog,
    FileUpload,
    LoadingCircle,
    FormsModule,
    EditEmail,
    EditPassword
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements AfterViewInit, OnInit {

  // region Injectables
  private _geoapify: GeoapifyService = inject(GeoapifyService);
  private _sanitizer: DomSanitizer = inject(DomSanitizer);
  private _userService: UserService = inject(UserService);
  private _router: Router = inject(Router);
  // endregion

  // region Leaflet map utilities
  private _map! : Map;
  private readonly _mapEl = 'map';
  private _currentMarker : WritableSignal<Marker | undefined> = signal(undefined);
  // endregion

  // region private user fields
  // local images are undefined when they haven't been changed with file dialogs
  private _localBackgroundImageUrl: WritableSignal<SafeUrl  | undefined> = signal(undefined);
  private _localProfileImageUrl: WritableSignal<SafeUrl  | undefined> = signal(undefined);
  private _backgroundImageUrl:WritableSignal<string | undefined> = signal(undefined);
  private _profileImageUrl:WritableSignal<string | undefined> = signal(undefined);
  private _userName  = signal("");
  private _email = signal("");
  private _phone = signal<undefined | string>(undefined);
  private _localization = signal<Localization | null> (null);
  // endregion

  // region Utility layout handling
  private _tempLocalization = signal<Localization | null> (null);
  private _dialogToTranslate = signal("");
  private _currentDialog: "" | "profileImage" | "backgroundImage"  = "";
  private _currentImageEdition: "" | "profile" | "background" = "";
  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();
  // endregion

  // region email edition
  OnEmailSubmitted(newEmail: string) {
    this._email.set(newEmail);
  }
  // endregion

  // region readonly user fields
  readonly profileImage:Signal<string> = computed(() => {
    if(this._localProfileImageUrl()) {
      return this._localProfileImageUrl()! as string;
    }
    if(this._profileImageUrl()) {
      return this._profileImageUrl()!;
    }
    return "../../../../assets/images/default_profile_pic.png";
  });
  readonly backgroundImage: Signal<string> = computed(() => {
    if(this._localBackgroundImageUrl()) {
      return this._localBackgroundImageUrl()! as string;
    }
    return this._backgroundImageUrl()!;
  });
  readonly hasBackgroundImage: Signal<boolean> = computed(() => !!this._backgroundImageUrl() || !!this._localBackgroundImageUrl());
  readonly userName: Signal<string> = this._userName.asReadonly();
  readonly email: Signal<string> = this._email.asReadonly();
  readonly phone: Signal<string> = computed(() =>
    this._phone() ?? "----"
  );
  readonly dialogToTranslate: Signal<string> = this._dialogToTranslate.asReadonly();
  readonly localization:Signal<string> = computed(() => {
    if (this.editLocalization()) {
      return this._tempLocalization()?.formatted ?? "----";
    }
    return this._localization()?.formatted ?? "----";
  });
  readonly displayUnsavedLocalization:Signal<boolean> = computed(() => {
    if(!this.editLocalization()) return false;
    return this._tempLocalization() !== this._localization();
  });
  readonly tempLocIsValid:Signal<boolean> = computed(() => {
    return this.ValidateLocalization(this._tempLocalization());
  })
  readonly phoneNumber = computed(() =>
    this._phone() === "" ? "----" : this._phone() );
  // endregion

  // region Edit switches
  private _editLocalization = signal(false);
  readonly editLocalization: Signal<boolean> = this._editLocalization.asReadonly();
  private _editPassword = signal(false);
  readonly editPassword: Signal<boolean> = this._editPassword.asReadonly();
  private _showConfirmationDialog = signal(false);
  readonly showConfirmationDialog: Signal<boolean> = this._showConfirmationDialog.asReadonly();
  private _showImageEditionDialog = signal(false);
  readonly showImageEditionDialog: Signal<boolean> = this._showImageEditionDialog.asReadonly();
  private _editEmail = signal(false);
  readonly editEmail: Signal<boolean> = this._editEmail.asReadonly();
  // endregion

  async ngOnInit() {
    await this.LoadUserInfo();
  }

  async LoadUserInfo() {
    const success = await this._userService.FetchCurrentUserInfo();
    if(!success) {
      return;
    }

    const location = this._userService.userInfo().location;
    this._userName.set(this._userService.userInfo().userName);
    this._email.set(this._userService.userInfo().email);
    this._phone.set(this._userService.userInfo().phoneNumber);
    this._profileImageUrl.set(this._userService.userInfo().photoUrl);
    this._backgroundImageUrl.set(this._userService.userInfo().backgroundUrl);
    this._loading.set(false);

    if(!location) return;

    this._localization.set({
      city: location.city,
      country: location.country,
      formatted: `${location.city}, ${location.state}, ${location.country}`,
      latitude: location.latitude,
      longitude: location.longitude,
      state: location.state,
    });
  }


  async OnLogoutClicked() {
    const success = await this._userService.Logout();
    if(success) {
      await this._router.navigateByUrl('');
    }
  }

  async LogoutAllDevices() {
    const success = await this._userService.LogoutAllDevices();
    if(!success) return;
    this._router.navigateByUrl('');
  }

  // region Field updating
  async UpdateUsername(name: string) {
    const success = await this._userService.ChangeUsername(name);
    if(!success) return;

    this._userName.set(name);
  }
  async UpdatePhone(phone: string) {
    const success = await this._userService.ChangePhoneNumber(phone);
    if(!success) return;

    this._phone.set(phone);
  }
  async UpdateLocalization() {
    if(this._tempLocalization() === this._localization()) return;
    if(this._tempLocalization() === null) return;

    const success = await this._userService.ChangeLocation(this._tempLocalization()!);
    if(!success) return;

    this._localization.set(this._tempLocalization());
    this.SwitchLocalizationEdition();
  }
  UpdateTempLocalization(newLoc: Localization | null) {
    if(newLoc == null) return;
    this._tempLocalization.set(newLoc);
    this.FlyTo(newLoc.latitude, newLoc.longitude, newLoc.city);
  }
  ShowConfirmationDialog() {
    this._showConfirmationDialog.set(true);
  }
  CloseConfirmationDialog() {
    this._showConfirmationDialog.set(false);
  }
  SwitchEditPassword() {
    this._editPassword.set(!this._editPassword());
  }
  ShowImageEditionDialog(image: "profile" | "background") {
    this._showImageEditionDialog.set(true);
    this._currentImageEdition = image;
  }
  private async DeleteProfileImage() {

    const success = this._userService.DeleteProfileImage();
    if(!success) return;

    if(this._localProfileImageUrl()) {
      URL.revokeObjectURL(this._localProfileImageUrl() as string);
      this._localProfileImageUrl.set(undefined);
    }
    this._profileImageUrl.set(undefined);

  }
  private async DeleteBackgroundImage() {

    const success = this._userService.DeleteBackgroundImage();
    if(!success) return;

    if(this._localBackgroundImageUrl()) {
      URL.revokeObjectURL(this._localBackgroundImageUrl() as string);
      this._localBackgroundImageUrl.set(undefined);
    }

    this._backgroundImageUrl.set(undefined);
  }
  ShowEditEmail() {
    this._editEmail.set(true);
  }
  HideEditEmail() {
    this._editEmail.set(false);
  }

  // endregion

  // region Confirmation dialogs
  OnDialogConfirmClicked() {
    if(this._currentDialog === "") return;
    this.CloseConfirmationDialog();

    if(this._currentDialog === "profileImage") {
      this.DeleteProfileImage();
      return;
    }

    if(this._currentDialog === "backgroundImage") {
      this.DeleteBackgroundImage();
      return;
    }
  }

  OnDialogCancelClicked() {
    this._currentDialog = "";
    this.CloseConfirmationDialog();
  }
  // endregion

  // region Image edition dialogs
  OnImageEditionCancelled() {
    this._showImageEditionDialog.set(false);
    this._currentImageEdition = "";
  }
  async OnImageEditionSubmitted(file: File) {
    this._showImageEditionDialog.set(false);
    if(this._currentImageEdition === "") return;

    if(this._currentImageEdition === "profile") {
      if(this._localProfileImageUrl()) {
        URL.revokeObjectURL(this._localProfileImageUrl() as string);
      }

      const success = await this._userService.ChangeProfileImage(file);
      if(!success) return;

      const objectUrl = URL.createObjectURL(file);
      this._localProfileImageUrl.set(this._sanitizer.sanitize(SecurityContext.URL, objectUrl) as SafeUrl);

      return;
    }

    if(this._currentImageEdition === "background") {
      if(this._localBackgroundImageUrl()) {
        URL.revokeObjectURL(this._localBackgroundImageUrl() as string);
      }

      const success = await this._userService.ChangeBackgroundImage(file);
      if(!success) return;

      const objectUrl = URL.createObjectURL(file);
      this._localBackgroundImageUrl.set(this._sanitizer.sanitize(SecurityContext.URL, objectUrl) as SafeUrl);

      return;
    }
  }
  TryDeleteProfileImage() {
    this.ShowConfirmationDialog();
    this._dialogToTranslate.set('user_edition.ask_delete_profile_image');
    this._currentDialog = "profileImage";
  }
  TryDeleteBackgroundImage() {
    this.ShowConfirmationDialog();
    this._dialogToTranslate.set('user_edition.ask_delete_background_image');
    this._currentDialog = "backgroundImage";
  }
  // endregion

  // region Validators (for inputs)
  readonly phoneValidators: ValidatorFn | ValidatorFn[] = [
    Validators.pattern(RegExp("\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*(\\d{1,2})$")),
    Validators.maxLength(20)
  ];
  readonly usernameValidators: ValidatorFn | ValidatorFn[] = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(RegExp("^[a-zA-Z0-9._@+-]+$"))
  ];
  // endregion


  //////////////////
  // Map handling //
  //////////////////

  // While app has server-side rendering, leaflet uses client-side.
  //    We need to handle this properly.
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
        this._localization()!.latitude,
        this._localization()!.longitude,
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

  private ValidateLocalization(loc : Localization | null) : boolean {
    if(loc === null) return false;
    if(!loc.city) return false;
    if(!loc.state) return false;
    return loc.country !== undefined;
  }

  GetPlace(lat :number, lng:number) {
    const request : LatLonPayloadDTO = {
      latitude: lat,
      longitude: lng,
      filter: "city"
    }
    this._geoapify.ReverseGeocode(request).subscribe({
      next: (response) => {
        if(this.ValidateLocalization(response)) {
          this._tempLocalization.set(response);
          this.FlyTo(response.latitude, response.longitude, response.city);
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
