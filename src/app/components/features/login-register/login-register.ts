import {Component, Signal, signal, WritableSignal, OnInit, computed, inject} from '@angular/core';
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
} from '../../../core/Utility/Validation';
import {UserService} from '../../../core/services/user-service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-register',
  imports: [TranslatePipe, ReactiveFormsModule, ScaledText
  ],
  templateUrl: './login-register.html',
  styleUrl: './login-register.css',
})
export class LoginRegister implements OnInit {

  // TODO API errors
  //  --> email, username used, awaiting email confirmation etc
  //  --> login_register.mail_used
  // TODO API integration & Google login

  private _showRegisterForm: WritableSignal<boolean> = signal(false);
  private _repeatPassMatch: WritableSignal<boolean> = signal(false);

  private _emailErrors: WritableSignal<string[]> = signal([]);
  private _passwordErrors: WritableSignal<string[]> = signal([]);
  private _usernameErrors: WritableSignal<string[]> = signal([]);
  private _phoneErrors: WritableSignal<string[]> = signal([]);

  emailErrors: Signal<string[]> = this._emailErrors;
  hasEmailErrors: Signal<boolean> = computed(() => this.emailErrors().length != 0);

  passwordErrors: Signal<string[]> = this._passwordErrors;
  hasPasswordErrors: Signal<boolean> = computed(() => this.passwordErrors().length != 0);
  repeatPassMatch: Signal<boolean> = this._repeatPassMatch;

  usernameErrors: WritableSignal<string[]> = this._usernameErrors;
  hasUsernameErrors: Signal<boolean> = computed(() => this.usernameErrors().length != 0);

  phoneErrors: WritableSignal<string[]> = this._phoneErrors;
  hasPhoneErrors: Signal<boolean> = computed(() => this._phoneErrors().length != 0);

  showRegisterForm: Signal<boolean> = this._showRegisterForm;
  formHasErrors: Signal<boolean> = computed(() => {
    if(this._showRegisterForm()) {
      return this.hasEmailErrors() ||
        this.hasPasswordErrors() ||
        this.hasUsernameErrors() ||
        !this.repeatPassMatch()
    } else {
      return this.hasEmailErrors() ||
        this.hasPasswordErrors();
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
        this.registerForm.get(
          'repeatPassword'
        )?.value === this.registerForm.get('password')?.value
      );
    });

    this.registerForm.get('repeatPassword')?.valueChanges.subscribe(() => {
      this._repeatPassMatch.set(
        this.registerForm.get('repeatPassword')?.value === this.registerForm.get('password')?.value
      );
    });
  }

  constructor(private translate: TranslateService, private userService: UserService) {
    this.translate.onLangChange.subscribe(() => {
      UpdateErrorTranslations(this.translate);
    });
    UpdateErrorTranslations(this.translate);

    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
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
      ])
    });

    this._usernameErrors.set(UpdateUsernameErrors(this.registerForm));
    this._phoneErrors.set(UpdatePhoneErrors(this.registerForm));
    this._emailErrors.set(UpdateEmailErrors(this.loginForm));
    this._emailErrors.set(UpdateEmailErrors(this.registerForm));
    this._passwordErrors.set(UpdatePasswordErrors(this.registerForm));
    this._passwordErrors.set(UpdatePasswordErrors(this.loginForm));

    this._repeatPassMatch.set(
      this.registerForm.get('repeatPassword')?.value === this.registerForm.get('password')?.value
    );
  }

  router = inject(Router);

  // Handle form submission
  async onSubmit() {
    let success = false;
    if (this.showRegisterForm()) {
      success = await this.userService.Register(
        this.registerForm.value.username,
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.phoneNumber === "" || this.registerForm.value.phoneNumber === undefined ?
          undefined : this.registerForm.value.phoneNumber
        );

      if(!success) {return;}

      success = await this.userService.Login(this.registerForm.value.email, this.registerForm.value.password);

      if(success) {
        // route to main
        this.router.navigate(['']);
        return;
      }

      this._showRegisterForm.set(false);
      return;
    }

    if (this.loginForm.valid) {
      success = await this.userService.Login(this.loginForm.value.email, this.loginForm.value.password);
      if(success) {
        // route to main
        this.router.navigate(['']);
        return;
      }
    }
  }
}
