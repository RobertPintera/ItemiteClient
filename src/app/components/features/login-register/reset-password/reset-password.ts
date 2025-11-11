import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ExternalConfigsLayout} from '../../../layouts/external-configs-layout/external-configs-layout';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ScaledText} from '../../../shared/scaled-text/scaled-text';
import {
  PasswordValidator,
  UpdatePasswordErrors,
} from '../../../../core/Utility/Validation';
import {UserService} from '../../../../core/services/user-service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingCircle} from '../../../shared/loading-circle/loading-circle';

@Component({
  selector: 'app-reset-password',
  imports: [
    ExternalConfigsLayout,
    TranslatePipe,
    ReactiveFormsModule,
    ScaledText,
    FormsModule,
    LoadingCircle
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  private _translate = inject(TranslateService);
  private _userService = inject(UserService);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  private _processing: WritableSignal<boolean> = signal(false);
  private _successfullyChanged: WritableSignal<boolean> = signal(false);
  readonly processing: Signal<boolean> = this._processing.asReadonly();
  readonly successfullyChanged: Signal<boolean> =  this._successfullyChanged.asReadonly();

  private _repeatPassMatch: WritableSignal<boolean> = signal(false);
  private _passwordErrors: WritableSignal<string[]> = signal([]);
  readonly passwordErrors: Signal<string[]> = this._passwordErrors.asReadonly();
  hasPasswordErrors: Signal<boolean> = computed(() => this.passwordErrors().length != 0);
  readonly repeatPassMatch: Signal<boolean> = this._repeatPassMatch.asReadonly();


  formHasErrors: Signal<boolean> = computed(() => {
    return this.hasPasswordErrors() ||
      !this.repeatPassMatch() ||
      this._token() === undefined ||
      this._email() === undefined ||
      this.processing() // Block when already processing
  });
  private _token = signal<string | undefined>(undefined);
  private _email = signal<string | undefined>(undefined);

  form: FormGroup;

  constructor() {
    this._activatedRoute.queryParams.subscribe((params) => {
      this._token.set(encodeURIComponent(params['token']));
      this._email.set(params['email']);
    });

    this.form = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(50),
        PasswordValidator
      ]),
      repeatPassword: new FormControl('', [])
    });
  }

  ngOnInit() {
    this.form.get('password')?.valueChanges.subscribe(() => {
      this._passwordErrors.set(UpdatePasswordErrors(this.form));
    });

    this.form.get('repeatPassword')?.valueChanges.subscribe(() => {
      this._repeatPassMatch.set(
        this.form.get('repeatPassword')?.value === this.form.get('password')?.value
      );
    });

    this._passwordErrors.set(UpdatePasswordErrors(this.form));
  }

  async OnSubmit() {
    if(this.formHasErrors()) return;

    this._processing.set(true);
    const success = await this._userService.ChangePassword(
      this._email()!,
      this.form.get("password")!.value,
      this._token()!
    );
    if(success) {
      this._successfullyChanged.set(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      this._processing.set(false);
      this._router.navigate(['login']);
      return;
    }
    this._processing.set(false);
  }
}
