import {Component, computed, inject, signal} from '@angular/core';
import {ExternalConfigsLayout} from '../../../layouts/external-configs-layout/external-configs-layout';
import {TranslatePipe} from '@ngx-translate/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Button} from '../../../shared/button/button';

@Component({
  selector: 'app-google-login-error',
  imports: [
    ExternalConfigsLayout,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './external-login-error.html',
  styleUrl: './external-login-error.css'
})
export class ExternalLoginError {
  private _activatedRoute = inject(ActivatedRoute);

  private _errorCode = signal<number | undefined>(undefined);
  readonly errorCode = this._errorCode.asReadonly();
  hasErrorCode = computed(() => !!this._errorCode());

  constructor() {
    this._activatedRoute.queryParams.subscribe(params => {
      this._errorCode.set(params['error']);
    })
  }

}
