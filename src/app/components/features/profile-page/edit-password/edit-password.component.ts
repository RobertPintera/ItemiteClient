import {Component, computed, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {PasswordValidator, UpdatePasswordErrors} from '../../../../core/Utility/Validation';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../core/services/user-service/user.service';
import {ScaledText} from '../../../shared/scaled-text/scaled-text';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadingCircle} from "../../../shared/loading-circle/loading-circle";

@Component({
  selector: 'app-change-password',
  imports: [
    ScaledText,
    TranslatePipe,
    ReactiveFormsModule,
    LoadingCircle
  ],
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.css'
})
export class EditPassword implements OnInit {
  private _userService: UserService = inject(UserService);
  changePasswordForm: FormGroup;

  changePasswordFormHasErrors: Signal<boolean> = computed(() => {
    return !this.repeatPassMatch() || this.hasPasswordErrors() || this.hasOldPasswordErrors();
  });
  private _oldPasswordErrors = signal<string[]>([]);
  private _passwordErrors = signal<string[]>([]);
  private _repeatPassMatch = signal<boolean>(true);
  readonly oldPasswordErrors = this._oldPasswordErrors.asReadonly();
  readonly repeatPassMatch = this._repeatPassMatch.asReadonly();
  readonly passwordErrors = this._passwordErrors..asReadonly();
  readonly hasPasswordErrors = computed(() => this.passwordErrors().length != 0);
  readonly hasOldPasswordErrors = computed(() => this.oldPasswordErrors().length != 0);

  private _passwordChangeSuccess = signal<undefined | boolean>(undefined);
  readonly passwordChangeSuccess = this._passwordChangeSuccess.asReadonly();

  private _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  ngOnInit(): void {
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

  constructor() {
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

  async OnPassChangeSubmit() {
    if(!this.changePasswordForm.valid || this.loading()) return;

    this._loading.set(true);
    const success = await this._userService.ChangePassword(
      this.changePasswordForm.get('passwordOld')!.value,
      this.changePasswordForm.get('password')!.value
    );
    this._loading.set(false);
    if(!success) return;

    this.changePasswordForm.get('passwordOld')!.setValue("");
    this.changePasswordForm.get('password')!.setValue("");
    this.changePasswordForm.get('repeatPassword')!.setValue("");

    this._passwordChangeSuccess.set(true);
    await new Promise(resolve => setTimeout(resolve, 5000));
    this._passwordChangeSuccess.set(undefined);

  }

}
