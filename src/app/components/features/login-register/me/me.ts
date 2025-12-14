import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth-service/auth.service';
import {UserService} from '../../../../core/services/user-service/user.service';

@Component({
  selector: 'app-me',
  imports: [],
  templateUrl: './me.html',
  styleUrl: './me.css'
})
export class Me {
  // This component is used to fetch user data after external logging.

  private _userService = inject(UserService);
  private _router= inject(Router);
  constructor() {
    this.GetUserData();
  }
  async GetUserData() {
    const success = await this._userService.FetchCurrentUserInfo();
    if(success) {
      await this._router.navigate(['']);
      return;
    }
    await this._router.navigate(['/login']);
  }
}
