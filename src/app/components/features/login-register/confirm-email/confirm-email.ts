import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth-service/auth.service';
import {ExternalConfigsLayout} from '../../../layouts/external-configs-layout/external-configs-layout';
import {UserService} from '../../../../core/services/user-service/user.service';

@Component({
  selector: 'app-confirm-email',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    ExternalConfigsLayout,
  ],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmail {
  private _termsOfUseError: WritableSignal<boolean> = signal(true);
  errorsPresent = computed(() => {
    return this._termsOfUseError() ||
      this._token() === undefined ||
      this._email() === undefined
  });

  private _token = signal<string | undefined>(undefined);
  private _email = signal<string | undefined>(undefined);

  private _activatedRoute = inject(ActivatedRoute);
  private _userService: UserService = inject(UserService);
  private _router: Router = inject(Router);

  constructor() {
    this._activatedRoute.queryParams.subscribe((params) => {
      this._token.set(encodeURIComponent(params['token']));
      this._email.set(params['email']);
    });
  }

  async OnSubmit() {
    if(this.errorsPresent()) return;
    const success = await this._userService.ConfirmEmail(this._email()!, this._token()!);
    if(!success) { return; }
    await this._router.navigate(['login']);
  }

  SetTermsConfirmed(event: any) {
    this._termsOfUseError.set(!event.srcElement.checked);
  }
}
