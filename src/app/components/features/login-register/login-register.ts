import {Component, Signal, signal, WritableSignal, OnInit, computed, inject, DOCUMENT} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {ScaledText} from '../../shared/scaled-text/scaled-text';
import {
  PasswordValidator,
  UpdateEmailErrors, UpdateErrorTranslations,
  UpdatePasswordErrors,
  UpdatePhoneErrors,
  UpdateUsernameErrors,
} from '../../../core/utility/Validation';
import {UserService} from '../../../core/services/user-service/user.service';
import {Router} from '@angular/router';
import {ForgotPassword} from './reset-password/forgot-password/forgot-password';
import {LoadingCircle} from '../../shared/loading-circle/loading-circle';
import {Document} from 'postcss';

@Component({
  selector: 'app-login-register',
  imports: [TranslatePipe, ReactiveFormsModule, ScaledText, ForgotPassword, LoadingCircle
  ],
  templateUrl: './login-register.html',
  styleUrl: './login-register.css',
})
export class LoginRegister implements OnInit {

  // TODO Block submit when API bad request until value change

  // TODO API errors
  //  --> email, username used, awaiting email confirmation etc
  //  --> login_register.mail_used
  // TODO API integration & Google login

  router = inject(Router);
  private _translate = inject(TranslateService);
  private _userService = inject(UserService);
  private _document = inject(DOCUMENT);

  private _showRegisterForm: WritableSignal<boolean> = signal(false);
  private _showForgotPasswordForm: WritableSignal<boolean> = signal(false);
  private _processing: WritableSignal<boolean> = signal(false);
  readonly processing: Signal<boolean> = this._processing.asReadonly();

  private _repeatPassMatch: WritableSignal<boolean> = signal(false);
  private _emailErrors: WritableSignal<string[]> = signal([]);
  private _passwordErrors: WritableSignal<string[]> = signal([]);
  private _usernameErrors: WritableSignal<string[]> = signal([]);
  private _phoneErrors: WritableSignal<string[]> = signal([]);

  readonly showForgotPasswordForm: Signal<boolean> = this._showForgotPasswordForm.asReadonly();

  readonly emailErrors: Signal<string[]> = this._emailErrors.asReadonly();
  hasEmailErrors: Signal<boolean> = computed(() => this.emailErrors().length != 0);

  readonly passwordErrors: Signal<string[]> = this._passwordErrors.asReadonly();
  hasPasswordErrors: Signal<boolean> = computed(() => this.passwordErrors().length != 0);
  readonly repeatPassMatch: Signal<boolean> = this._repeatPassMatch.asReadonly();

  readonly usernameErrors: Signal<string[]> = this._usernameErrors.asReadonly();
  hasUsernameErrors: Signal<boolean> = computed(() => this.usernameErrors().length != 0);

  readonly phoneErrors: Signal<string[]> = this._phoneErrors.asReadonly();
  hasPhoneErrors: Signal<boolean> = computed(() => this._phoneErrors().length != 0);

  readonly showRegisterForm: Signal<boolean> = this._showRegisterForm.asReadonly();
  formHasErrors: Signal<boolean> = computed(() => {
    if(this._showRegisterForm()) {
      return this.hasEmailErrors() ||
        this.hasPasswordErrors() ||
        this.hasUsernameErrors() ||
        !this.repeatPassMatch() ||
        this.processing() // Block when already processing
    } else {
      return this.hasEmailErrors() ||
        this.hasPasswordErrors() ||
        this.processing() // Block when already processing
    }
  });

  async SwitchShowRegister() {
    // Wait for 0.5s for the animation to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    this._showRegisterForm.set(!this._showRegisterForm());

    this._passwordErrors.set([]);
    this._emailErrors.set([]);

    this._emailErrors.set(UpdateEmailErrors(this.showRegisterForm() ? this.registerForm : this.loginForm));
    this._passwordErrors.set(UpdatePasswordErrors(this.showRegisterForm() ? this.registerForm : this.loginForm));
  }

  SwitchShowForgotPassword() {
    this._showForgotPasswordForm.set(!this._showForgotPasswordForm());
  }

  loginForm: FormGroup;
  registerForm: FormGroup;

  ngOnInit() {

    // Login form
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      this._emailErrors.set(UpdateEmailErrors(this.loginForm));
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this._passwordErrors.set(UpdatePasswordErrors(this.loginForm));
    });

    // Register form
    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this._emailErrors.set(UpdateEmailErrors(this.registerForm));
    });

    this.registerForm.get('username')?.valueChanges.subscribe(() => {
      this._usernameErrors.set(UpdateUsernameErrors(this.registerForm));
    });

    this.registerForm.get('phoneNumber')?.valueChanges.subscribe(() => {
      this._phoneErrors.set(UpdatePhoneErrors(this.registerForm));
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this._passwordErrors.set(UpdatePasswordErrors(this.registerForm));
      this._repeatPassMatch.set(
        this.registerForm.get('repeatPassword')?.value === this.registerForm.get('password')?.value
      );
    });

    this.registerForm.get('repeatPassword')?.valueChanges.subscribe(() => {
      this._repeatPassMatch.set(
        this.registerForm.get('repeatPassword')?.value === this.registerForm.get('password')?.value
      );
    });
  }

  constructor() {
    this._translate.onLangChange.subscribe(() => {
      UpdateErrorTranslations(this._translate);
    });
    UpdateErrorTranslations(this._translate);

    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ])
    });
    this.registerForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(RegExp("^[a-zA-Z0-9._@+-]+$"))
      ]),
      phoneNumber: new FormControl('', [
        Validators.pattern(RegExp("\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*(\\d{1,2})$")),
        Validators.maxLength(20),
        Validators.minLength(7)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(50),
        PasswordValidator
      ]),
      repeatPassword: new FormControl('', [])
    });

    this._usernameErrors.set(UpdateUsernameErrors(this.registerForm));
    this._phoneErrors.set(UpdatePhoneErrors(this.registerForm));
    this._emailErrors.set(UpdateEmailErrors(this.loginForm));
    this._passwordErrors.set(UpdatePasswordErrors(this.loginForm));

    this._repeatPassMatch.set(
      this.registerForm.get('repeatPassword')?.value === this.registerForm.get('password')?.value
    );
  }

  // Handle form submission
  async onSubmit() {
    let success = false;
    this._processing.set(true);
    if (this.showRegisterForm()) {
      success = await this._userService.Register(
        this.registerForm.value.username,
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.phoneNumber === "" || this.registerForm.value.phoneNumber === undefined ?
          undefined : this.registerForm.value.phoneNumber
        );

      if(!success) {this._processing.set(false); return;}

      success = await this._userService.Login(this.registerForm.value.email, this.registerForm.value.password);

      if(success) {
        // route to main
        this.router.navigate(['']);
        return;
      }

      this.SwitchShowRegister();
      this._processing.set(false);
      return;
    }

    if (this.loginForm.valid) {
      this._processing.set(true);
      success = await this._userService.Login(this.loginForm.value.email, this.loginForm.value.password);
      if(success) {
        // route to main
        this.router.navigate(['']);
        this._processing.set(false);
        return;
      }
      this._processing.set(false);
    }
  }

  async LoginByGoogle() {
    this._document.location.href = this._userService.LoginWithGoogle();
  }
}
