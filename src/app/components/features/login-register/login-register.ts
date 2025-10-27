import {Component, Signal, signal, WritableSignal, OnInit, computed} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import {ScaledText} from '../../shared/scaled-text/scaled-text';

@Component({
  selector: 'app-login-register',
  imports: [TranslatePipe, ReactiveFormsModule, ScaledText
  ],
  templateUrl: './login-register.html',
  styleUrl: './login-register.css',
})
export class LoginRegister implements OnInit {
  private _showRegisterForm: WritableSignal<boolean> = signal(false);
  private _repeatPassMatch: WritableSignal<boolean> = signal(false);

  private _emailErrors: WritableSignal<string[]> = signal([]);
  private _passwordErrors: WritableSignal<string[]> = signal([]);
  private _usernameErrors: WritableSignal<string[]> = signal([]);
  private _phoneErrors: WritableSignal<string[]> = signal([]);
  private _termsOfUseError: WritableSignal<boolean> = signal(true);

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
        !this.repeatPassMatch() ||
        this._termsOfUseError();
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

    this.updateEmailErrors(this.showRegisterForm() ? this.registerForm : this.loginForm);
    this.updatePasswordErrors(this.showRegisterForm() ? this.registerForm : this.loginForm);
  }

  loginForm: FormGroup;
  registerForm: FormGroup;

  ngOnInit() {

    // Login form

    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      this.updateEmailErrors(this.loginForm);
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.updatePasswordErrors(this.loginForm);
    });

    // Register form

    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this.updateEmailErrors(this.registerForm);
    });

    this.registerForm.get('username')?.valueChanges.subscribe(() => {
      this.updateUsernameErrors();
    });

    this.registerForm.get('phoneNumber')?.valueChanges.subscribe(() => {
      this.updatePhoneErrors();
    });

    this.registerForm.get('terms')?.valueChanges.subscribe((value:boolean)=> {
      this._termsOfUseError.set(!value);
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.updatePasswordErrors(this.registerForm);
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

  constructor() {
    // Initialize form group with email and password fields

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
        Validators.maxLength(100)
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),
      phoneNumber: new FormControl('', [
        Validators.pattern(RegExp("\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*\\d\\W*(\\d{1,2})$")),
        Validators.maxLength(20)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(50),
        passwordValidator()
      ]),
      repeatPassword: new FormControl(''),
      terms: new FormControl(false, [
        Validators.required
      ])
    });

    this.updateUsernameErrors();
    this.updatePhoneErrors();
    this.updateEmailErrors(this.loginForm);
    this.updateEmailErrors(this.registerForm);
    this.updatePasswordErrors(this.loginForm);
    this.updatePasswordErrors(this.registerForm);
    this._repeatPassMatch.set(
      this.registerForm.get('repeatPassword')?.value === this.registerForm.get('password')?.value
    );
  }

  private updateUsernameErrors() {
    const usernameControl = this.registerForm.get('username');

    const errors: string[] = [];

    if (usernameControl?.hasError('required')) {
      errors.push('Username is required');
    }

    if (usernameControl?.hasError('minlength')) {
      errors.push('Username must be at least 3 characters long');
    }

    if (usernameControl?.hasError('maxlength')) {
      errors.push('Username cannot be more than 20 characters');
    }

    this._usernameErrors.set(errors);
  }

  private updatePhoneErrors() {
    const control = this.registerForm.get('phoneNumber');

    const errors: string[] = [];

    if (control?.hasError('required')) {
      errors.push('Phone number is required');
    }

    if (control?.hasError('pattern')) {
      errors.push('Phone number must be valid');
    }

    if (control?.hasError('maxlength')) {
      errors.push('Phone number cannot be more than 20 characters');
    }

    this._phoneErrors.set(errors);
  }

  private updateEmailErrors(formGroup:FormGroup) {
    const emailControl = formGroup.get('email');

    const errors: string[] = [];

    if (emailControl?.hasError('required')) {
      errors.push('Email is required');
    }

    if (emailControl?.hasError('email')) {
      errors.push('Email must be a valid email address');
    }

    this._emailErrors.set(errors); // Update emailErrors signal
  }

  private updatePasswordErrors(formGroup:FormGroup) {
    const passwordControl = formGroup.get('password');
    const errors: string[] = [];

    if (passwordControl?.hasError('required')) {
      errors.push('Password is required');
    }

    if (passwordControl?.hasError('minlength')) {
      errors.push('Password must be at least 7 characters long');
    }

    if (passwordControl?.hasError('maxlength')) {
      errors.push('Password cannot be more than 50 characters');
    }

    const controlErrors = passwordControl?.errors;
    if (controlErrors) {
      // Handle custom password errors
      if (controlErrors['uppercase']) {
        errors.push(controlErrors['uppercase']);
      }
      if (controlErrors['lowercase']) {
        errors.push(controlErrors['lowercase']);
      }
      if (controlErrors['digit']) {
        errors.push(controlErrors['digit']);
      }
      if (controlErrors['special']) {
        errors.push(controlErrors['special']);
      }
    }


    this._passwordErrors.set(errors); // Update passwordErrors signal
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
  }
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    const errors: { [key: string]: any } = {};

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors['uppercase'] = 'Password must contain at least one uppercase letter';
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors['lowercase'] = 'Password must contain at least one lowercase letter';
    }

    // Check for digit
    if (!/[0-9]/.test(password)) {
      errors['digit'] = 'Password must contain at least one digit';
    }

    // Check for special character
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors['special'] = 'Password must contain at least one special character';
    }

    return Object.keys(errors).length ? errors : null;
  };
}
