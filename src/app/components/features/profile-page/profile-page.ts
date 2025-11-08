import {
  AfterViewInit,
  Component,
  computed,
  inject, OnInit,
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
import {FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ScaledText} from '../../shared/scaled-text/scaled-text';
import {PasswordValidator, UpdatePasswordErrors} from '../../../core/Utility/Validation';
import {ConfirmDialog} from '../../shared/confirm-dialog/confirm-dialog';
import {FileUpload} from '../../shared/file-upload/file-upload';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-profile-page',
  imports: [
    GeocoderAutocomplete,
    EditableText,
    TranslatePipe,
    ReactiveFormsModule,
    ScaledText,
    ConfirmDialog,
    FileUpload
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements AfterViewInit, OnInit {
  private _map! : Map;
  private readonly _mapEl = 'map';
  private _currentMarker : WritableSignal<Marker | undefined> = signal(undefined);

  // Local images are undefined when they haven't been changed with file dialogs
  private _localBackgroundImageUrl: WritableSignal<string | undefined> = signal(undefined);
  private _localProfileImageUrl: WritableSignal<string | undefined> = signal(undefined);

  private _backgroundImageUrl:WritableSignal<string | undefined> = signal(undefined);
  private _profileImageUrl:WritableSignal<string | undefined> = signal(undefined);
  private _userName  = signal("Dawid Pacia");
  private _email = signal("robert@wojcik.pl");
  private _phone = signal("+48 233 122 423");
  private _localization = signal<Localization | null> (null);
  private _tempLocalization = signal<Localization | null> (null);
  private _dialogToTranslate = signal("");
  private _currentDialog: "" | "profileImage" | "backgroundImage"  = "";
  private _currentImageEdition: "" | "profile" | "background" = "";

  changePasswordForm: FormGroup;
  changePasswordFormHasErrors: Signal<boolean> = computed(() => {
    return !this.repeatPassMatch() || this.hasPasswordErrors() || this.hasOldPasswordErrors();
  });
  private _oldPasswordErrors: WritableSignal<string[]> = signal([]);
  private _passwordErrors: WritableSignal<string[]> = signal([]);
  private _repeatPassMatch: WritableSignal<boolean> = signal(true);
  oldPasswordErrors: Signal<string[]> = this._oldPasswordErrors;
  repeatPassMatch: Signal<boolean> = this._repeatPassMatch;
  passwordErrors: Signal<string[]> = this._passwordErrors;
  hasPasswordErrors: Signal<boolean> = computed(() => this.passwordErrors().length != 0);
  hasOldPasswordErrors: Signal<boolean> = computed(() => this.oldPasswordErrors().length != 0);

  profileImage:Signal<string> = computed(() => {
    if(this._localProfileImageUrl()) {
      return this._localProfileImageUrl()!;
    }
    if(this._profileImageUrl()) {
      return this._profileImageUrl()!;
    }
    return "../../../../assets/images/default_profile_pic.png";
  });
  backgroundImage: Signal<string> = computed(() => {
    if(this._localBackgroundImageUrl()) {
      return this._localBackgroundImageUrl()!;
    }
    return this._backgroundImageUrl()!;
  });
  hasBackgroundImage: Signal<boolean> = computed(() => !!this._backgroundImageUrl() || !!this._localBackgroundImageUrl());

  userName: Signal<string> = this._userName;
  email: Signal<string> = this._email;
  phone: Signal<string> = computed(() =>
    this._phone() == "" ? "----" : this._phone()
  );
  dialogToTranslate: Signal<string> = this._dialogToTranslate;

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
  private _showConfirmationDialog = signal(false);
  showConfirmationDialog: Signal<boolean> = this._showConfirmationDialog;
  private _showImageEditionDialog = signal(false);
  showImageEditionDialog: Signal<boolean> = this._showImageEditionDialog;

  constructor(private geoapify: GeoapifyService, private sanitizer: DomSanitizer) {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(50),
        PasswordValidator()
      ]),
      repeatPassword: new FormControl(''),
      passwordOld: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ])
    });
  }

  ngOnInit() {
    this.changePasswordForm.get('password')?.valueChanges.subscribe(() => {
      this._passwordErrors.set(UpdatePasswordErrors(this.changePasswordForm));
      this._repeatPassMatch.set(
        this.changePasswordForm.get(
          'repeatPassword'
        )?.value === this.changePasswordForm.get('password')?.value
      );
    });

    this.changePasswordForm.get('repeatPassword')?.valueChanges.subscribe(() => {
      this._repeatPassMatch.set(
        this.changePasswordForm.get('repeatPassword')?.value === this.changePasswordForm.get('password')?.value
      );
    });

    this.changePasswordForm.get('passwordOld')?.valueChanges.subscribe(() => {
      this._oldPasswordErrors.set(UpdatePasswordErrors(this.changePasswordForm, "passwordOld"));
    });

    this._passwordErrors.set(UpdatePasswordErrors(this.changePasswordForm));
    this._oldPasswordErrors.set(UpdatePasswordErrors(this.changePasswordForm, "passwordOld"));
  }

  // Field updating
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

  // Confirmation dialogs
  OnDialogConfirmClicked() {
    if(this._currentDialog === "") return;
    this.CloseConfirmationDialog();

    if(this._currentDialog === "profileImage") {
      if(this._localProfileImageUrl()) {
        URL.revokeObjectURL(this._localProfileImageUrl()!);
        this._localProfileImageUrl.set(undefined);
      }
      // TODO call API
      return;
    }

    if(this._currentDialog === "backgroundImage") {
      if(this._localBackgroundImageUrl()) {
        URL.revokeObjectURL(this._localBackgroundImageUrl()!);
        this._localBackgroundImageUrl.set(undefined);
      }
      // TODO call API
      return;
    }
  }
  OnDialogCancelClicked() {
    this._currentDialog = "";
    this.CloseConfirmationDialog();
  }

  // Image edition dialogs
  OnImageEditionCancelled() {
    this._showImageEditionDialog.set(false);
    this._currentImageEdition = "";
  }
  OnImageEditionSubmitted(file: File) {
    this._showImageEditionDialog.set(false);
    if(this._currentImageEdition === "") return;

    if(this._currentImageEdition === "profile") {
      if(this._localProfileImageUrl()) {
        URL.revokeObjectURL(this._localProfileImageUrl()!);
      }
      this._localProfileImageUrl.set(URL.createObjectURL(file));
      this.sanitizer.bypassSecurityTrustUrl(this._localProfileImageUrl()!);

      // TODO call API
      return;
    }

    if(this._currentImageEdition === "background") {
      if(this._localBackgroundImageUrl()) {
        URL.revokeObjectURL(this._localBackgroundImageUrl()!);
      }
      this._localBackgroundImageUrl.set(URL.createObjectURL(file));
      this.sanitizer.bypassSecurityTrustUrl(this._localBackgroundImageUrl()!);

      // TODO call API
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

  // Validators
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
    this.geoapify.ReverseGeocode(request).subscribe({
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

  onPassChangeSubmit() {

  }
}
