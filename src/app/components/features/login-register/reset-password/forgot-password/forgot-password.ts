import {Component, computed, inject, OnInit, output, signal, Signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ScaledText} from "../../../../shared/scaled-text/scaled-text";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {UpdateEmailErrors, UpdateErrorTranslations} from '../../../../../core/utility/Validation';
import {UserService} from '../../../../../core/services/user-service/user.service';
import {LoadingCircle} from '../../../../shared/loading-circle/loading-circle';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    ScaledText,
    TranslatePipe,
    LoadingCircle
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {

  // TODO IN OTHER COMPONENTS TOO
  //    block form submit [!until field update!]
  //    after one try if one of api errors of code bad request 400 happened

  onExit = output();
  private _translate = inject(TranslateService);
  private _userService= inject(UserService);

  form: FormGroup;

  private _emailErrors: WritableSignal<string[]> = signal([]);
  private _email : string = "";
  emailErrors: Signal<string[]> = this._emailErrors.asReadonly();
  hasEmailErrors: Signal<boolean> = computed(() => this.emailErrors().length != 0);
  formHasErrors: Signal<boolean> = computed(() => {
    return this.hasEmailErrors();
  });

  private _performedSuccessfulRequest = signal<boolean>(false);
  performedSuccessfulRequest :Signal<boolean> = this._performedSuccessfulRequest.asReadonly();
  private _isProcessing = signal<boolean>(false);
  readonly isProcessing: Signal<boolean>  = this._isProcessing.asReadonly();

  constructor() {
    this._translate.onLangChange.subscribe(() => {
      UpdateErrorTranslations(this._translate);
    });
    UpdateErrorTranslations(this._translate);

    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    })
  };

  ngOnInit(): void {
    this.form.get('email')?.valueChanges.subscribe(() => {
      this._emailErrors.set(UpdateEmailErrors(this.form, "email"));
      this._email = this.form.get('email')!.value;
    });
    this._emailErrors.set(UpdateEmailErrors(this.form, "email"));
  }

  OnExitClicked() {
    this.onExit.emit();
  }

  async OnSubmit() {
    if(!this.form.valid) return;
    // todo loading wheel
    this._isProcessing.set(true);
    const success = await this._userService.RequestPasswordReset(this._email);
    if(success) {
      this._performedSuccessfulRequest.set(true);
    }
    this._isProcessing.set(false);
  }
}
