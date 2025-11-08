import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {errorTranslations} from '../constants/ErrorTranslations';
export function PasswordValidator(): ValidatorFn {
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

//////////////////////
// Validator errors //
//////////////////////

export function UpdateUsernameErrors(formGroup: FormGroup, controlName = 'username') : string[] {
  const usernameControl = formGroup.get(controlName);

  const errors: string[] = [];

  if (usernameControl?.hasError('required')) {
    const translation:string = errorTranslations.get(`field_empty`)!;
    errors.push(translation);
  }

  if (usernameControl?.hasError('minlength')) {
    const translation:string = errorTranslations.get(`name_min_len`)!;
    errors.push(translation);
  }

  if (usernameControl?.hasError('maxlength')) {
    const translation:string = errorTranslations.get(`name_max_len`)!;
    errors.push(translation);
  }

  if(usernameControl?.hasError('pattern')) {
    const translation:string = errorTranslations.get(`name_pattern`)!;
    errors.push(translation);
  }

  return errors;
}

export function UpdatePhoneErrors(formGroup: FormGroup, controlName = 'phoneNumber'): string[] {
  const control = formGroup.get(controlName);

  const errors: string[] = [];

  if (control?.hasError('required')) {
    const translation:string = errorTranslations.get(`field_empty`)!;
    errors.push(translation);
  }

  if (control?.hasError('pattern')) {
    const translation:string = errorTranslations.get(`field_regex`)!;
    errors.push(translation);
  }

  if (control?.hasError('maxlength')) {
    const translation:string = errorTranslations.get(`phone_max_len`)!;
    errors.push(translation);
  }

  if (control?.hasError('minLength')) {
    const translation:string = errorTranslations.get(`phone_min_len`)!;
    errors.push(translation);
  }

  return errors;
}

export function UpdateEmailErrors(formGroup: FormGroup, controlName = 'email'): string[] {
  const control = formGroup.get(controlName);

  const errors: string[] = [];

  if (control?.hasError('minlength')) {
    const translation:string = errorTranslations.get(`mail_min_len`)!;
    errors.push(translation);
  }

  if (control?.hasError('maxlength')) {
    const translation:string = errorTranslations.get(`mail_max_len`)!;
    errors.push(translation);
  }

  if (control?.hasError('required')) {
    const translation:string = errorTranslations.get(`field_empty`)!;
    errors.push(translation);
  }

  if (control?.hasError('email')) {
    const translation:string = errorTranslations.get(`field_regex`)!;
    errors.push(translation);
  }

  return errors;
}

export function UpdatePasswordErrors(formGroup: FormGroup, controlName = 'password'): string[] {
  const passwordControl = formGroup.get(controlName);
  const errors: string[] = [];

  if (passwordControl?.hasError('required')) {
    const translation:string = errorTranslations.get(`field_empty`)!;
    errors.push(translation);
  }

  if (passwordControl?.hasError('minlength')) {
    const translation:string = errorTranslations.get(`pass_min_len`)!;
    errors.push(translation);
  }

  if (passwordControl?.hasError('maxlength')) {
    const translation:string = errorTranslations.get(`pas_max_len`)!;
    errors.push(translation);
  }

  const controlErrors = passwordControl?.errors;
  if (controlErrors) {
    // Handle custom password errors
    if (controlErrors['uppercase']) {
      const translation:string = errorTranslations.get(`pass_uppercase`)!;
      errors.push(translation);
    }
    if (controlErrors['lowercase']) {
      const translation:string = errorTranslations.get(`pass_lowercase`)!;
      errors.push(translation);
    }
    if (controlErrors['digit']) {
      const translation:string = errorTranslations.get(`pass_digit`)!;
      errors.push(translation);
    }
    if (controlErrors['special']) {
      const translation:string = errorTranslations.get(`pass_special`)!;
      errors.push(translation);
    }
  }
  return errors;
}

///////////////////////////////
// Update error translations //
///////////////////////////////
export function UpdateErrorTranslations(translateService: TranslateService) {
  for(const translationKey of errorTranslations.keys()) {
    translateService.get(`validator_errors.${translationKey}`).subscribe((translatedText: string) => {
      errorTranslations.set(translationKey, translatedText);
    });
  }
}
