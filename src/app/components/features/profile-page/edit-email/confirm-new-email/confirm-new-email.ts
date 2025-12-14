import {Component, effect, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../../core/services/auth-service/auth.service';
import {ExternalConfigsLayout} from '../../../../layouts/external-configs-layout/external-configs-layout';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadingCircle} from '../../../../shared/loading-circle/loading-circle';
import {ErrorHandlerService} from '../../../../../core/services/error-handler-service/error-handler-service';
import {UserService} from '../../../../../core/services/user-service/user.service';

@Component({
  selector: 'app-confirm-new-email',
  imports: [
    ExternalConfigsLayout,
    TranslatePipe,
    LoadingCircle
  ],
  templateUrl: './confirm-new-email.html',
  styleUrl: './confirm-new-email.css'
})
export class ConfirmNewEmail {
  private _errorHandler = inject(ErrorHandlerService);
  private _activatedRoute = inject(ActivatedRoute);
  private _userService = inject(UserService);
  private _router = inject(Router);

  private _token = signal<string | undefined>(undefined);
  private _email = signal<string | undefined>(undefined);

  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();
  private _success =  signal(false);
  readonly success = this._success.asReadonly();

  constructor() {
    this._activatedRoute.queryParams.subscribe((params) => {
      this._token.set(params['token']);
      this._email.set(params['currentEmail']);

      this.CallApi();
    });
  }

  async CallApi() {
    if(!this._token() || !this._email()) return;

    this._loading.set(true);
    this._success.set(await this._userService.ConfirmChangeEmail(this._token()!, this._email()!));

    console.log(this._errorHandler.lastErrorCode());
    if(!this._success() &&
      this._errorHandler.lastErrorCode() === "401" || this._errorHandler.lastErrorCode() === "400") return;

    this._loading.set(false);
  }

  OnReturnClicked() {
    this._router.navigate(['']);
  }
}
