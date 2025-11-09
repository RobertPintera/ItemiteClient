import {Component, computed, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ScaledText} from "../../../../shared/scaled-text/scaled-text";
import {TranslatePipe} from '@ngx-translate/core';
import {UpdateEmailErrors, UpdatePhoneErrors} from '../../../../../core/Utility/Validation';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    ScaledText,
    TranslatePipe
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {
  // TODO IN OTHER COMPONENTS TOO
  //    block form completely [!until field update!]
  //    after one try if one of api errors of code bad request happened:

  form: FormGroup;

  private _emailErrors: WritableSignal<string[]> = signal([]);
  emailErrors: Signal<string[]> = this._emailErrors;
  hasEmailErrors: Signal<boolean> = computed(() => this.emailErrors().length != 0);

  formHasErrors: Signal<boolean> = computed(() => {
    return this.hasEmailErrors();
  });

  constructor() {
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
    });
  }

  onSubmit() {

  }
}
