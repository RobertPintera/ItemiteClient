import {Component, computed, inject, OnInit, output, Signal, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {PasswordValidator, UpdateEmailErrors, UpdatePasswordErrors} from '../../../../core/utility/Validation';
import {ScaledText} from '../../../shared/scaled-text/scaled-text';
import {UserService} from '../../../../core/services/user-service/user.service';
import {LoadingCircle} from "../../../shared/loading-circle/loading-circle";

@Component({
  selector: 'app-edit-email',
  imports: [
    FormsModule,
    TranslatePipe,
    ReactiveFormsModule,
    ScaledText,
    LoadingCircle
  ],
  templateUrl: './edit-email.html',
  styleUrl: './edit-email.css'
})
export class EditEmail implements OnInit {

  userService = inject(UserService);

  onCancel = output();
  onSubmitted = output<string>();

  private _emailErrors: WritableSignal<string[]> = signal([]);
  private _passwordErrors: WritableSignal<string[]> = signal([]);
  readonly passwordErrors: Signal<string[]> = this._passwordErrors.asReadonly();
  readonly emailErrors: Signal<string[]> = this._emailErrors.asReadonly();
  hasPasswordErrors: Signal<boolean> = computed(() => this.passwordErrors().length != 0);
  hasEmailErrors: Signal<boolean> = computed(() => this.emailErrors().length != 0);

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _performedSuccessfulRequest = signal(false);
  readonly performedSuccessfulRequest = this._performedSuccessfulRequest.asReadonly();

  changeEmailForm: FormGroup;

  constructor() {
    this.changeEmailForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      emailNew: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
    });
  }

  ngOnInit () {
    this.changeEmailForm.get('password')?.valueChanges.subscribe(() => {
      this._passwordErrors.set(UpdatePasswordErrors(this.changeEmailForm, "password"));
    });

    this.changeEmailForm.get('emailNew')?.valueChanges.subscribe(() => {
      this._emailErrors.set(UpdateEmailErrors(this.changeEmailForm, "emailNew"));
    });

    this._emailErrors.set(UpdateEmailErrors(this.changeEmailForm, "emailNew"));
    this._passwordErrors.set(UpdatePasswordErrors(this.changeEmailForm, "password"));
  }

  OnCancelClicked() {
    this.onCancel.emit();
  }

  async OnSubmit() {
    if(!this.changeEmailForm.valid) return;

    this._loading.set(true);
    const success = await this.userService.ChangeEmail(
      this.changeEmailForm.get("emailNew")!.value,
      this.changeEmailForm.get("password")!.value,
    )
    this._loading.set(false);
    this._performedSuccessfulRequest.set(success);
  }

}
