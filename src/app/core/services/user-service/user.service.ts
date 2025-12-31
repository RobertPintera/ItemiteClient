import {lastValueFrom} from 'rxjs';
import {environment} from '../../../../environments/environment.development';
import {User} from '../../models/user/User';
import {Localization} from '../../models/location/Localization';
import {HttpClient, HttpParams} from '@angular/common/http';
import {computed, effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {UserBasicInfo} from '../../models/user/UserBasicInfo';
import {AuthService} from '../auth-service/auth.service';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userInfo = signal<User>(
    {
      id: -1,
      userName: '',
      email: '',
      location: undefined,
      phoneNumber: undefined,
      photoUrl: undefined,
      backgroundUrl: undefined,
      roles: []
    }
  );

  private authService:AuthService = inject(AuthService);
  private http: HttpClient = inject(HttpClient);
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);
  private _platformId = inject(PLATFORM_ID);

  readonly userInfo = this._userInfo.asReadonly();

  // shortcuts for easier refactoring and access
  isUserLoggedIn = computed(() =>
    this.authService.isUserLoggedIn()
  );
  userBasicInfo = computed(() =>
    this.authService.userBasicInfo()
  );

  constructor() {
    if(!isPlatformBrowser(this._platformId)) return;

    effect(() => {
      if(!this.authService.isUserLoggedIn()) {
        this.ClearUserInfo();
      }
    });

    effect(() => {
      if(this.authService.userInfo().id < 0) return;

      this._userInfo.set(
        this.authService.userInfo()
      );
    });

    this.OnServiceEnter();
  }

  async OnServiceEnter() {
    // Check if cookies are set, valid and user is logged in
    await this.FetchCurrentUserInfo();
    console.log(this.userInfo());
  }

  async RequestPasswordReset(email: string): Promise<boolean> {
    const payload = {email: email};
    try {
      await lastValueFrom(
        this.http.post(`${environment.itemiteApiUrl}/auth/forgot-password`, payload, {timeout: 15000})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ResetPassword(email: string, password: string, token: string): Promise<boolean> {
    const payload = {email: email, password: password, token: token};
    try {
      await lastValueFrom(
        this.http.post(`${environment.itemiteApiUrl}/auth/reset-password`, payload, {timeout: 10000})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  // This function won't trigger error notification
  //  it's intentional
  async FetchCurrentUserInfo(): Promise<boolean> {
    try {
      this._userInfo.set(
        await lastValueFrom(
          this.http.get<User>(`${environment.itemiteApiUrl}/user/me`, {withCredentials: true}))
      );
      return true;
    } catch (error: any) {
      // User is no longer logged-in
      if(error.status == 401) {
        this.ClearUserInfo();
        this.errorHandlerService.InvokeLoggedOutEvent();
      }
      return false;
    }
  }

  private ClearUserInfo(): void {
    this._userInfo.set({
      id: -1,
      userName: '',
      email: '',
      location: undefined,
      phoneNumber: undefined,
      photoUrl: undefined,
      backgroundUrl: undefined,
      roles: []
    })
  }

  async ChangeUsername(newUsername: string): Promise<boolean> {
    const payload = {newUsername: newUsername};
    try {
      await lastValueFrom(
        this.http.put(`${environment.itemiteApiUrl}/user/settings/change-username`, payload, {timeout: 10000, withCredentials: true})
      );
      return true;
    } catch(error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ChangePhoneNumber(number: string) {
    const payload = {phoneNumber: number};
    try {
      await lastValueFrom(
        this.http.put(`${environment.itemiteApiUrl}/user/settings/change-phone-number`, payload, {timeout: 10000, withCredentials: true})
      );
      return true;
    } catch(error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ChangeLocation(newLocation: Localization) {
    const payload = {
      location: {
        longitude: newLocation.longitude,
        latitude: newLocation.latitude,
        country: newLocation.country,
        city: newLocation.city,
        state: newLocation.state
      }
    };
    try {
      await lastValueFrom(
        this.http.put(`${environment.itemiteApiUrl}/user/settings/change-location`, payload, {timeout: 10000, withCredentials: true})
      );
      return true;
    } catch(error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ChangeProfileImage(newImage: File) {
    const payload = new FormData();
    payload.append('file', newImage);

    try {
      await lastValueFrom(
        this.http.post<string>(`${environment.itemiteApiUrl}/user/profile/picture`, payload, {timeout: 10000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ChangePassword(oldPassword:string, newPassword:string) {
    const payload = {oldPassword: oldPassword, newPassword: newPassword};
    try {
      await lastValueFrom(
        this.http.post<string>(`${environment.itemiteApiUrl}/user/settings/change-password`, payload, {timeout: 10000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ChangeBackgroundImage(newImage: File) {
    const payload = new FormData();
    payload.append('file', newImage);

    try {
      await lastValueFrom(
        this.http.post<string>(`${environment.itemiteApiUrl}/user/profile/background`, payload, {timeout: 10000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async DeleteProfileImage() {
    try {
      await lastValueFrom(
        this.http.delete(`${environment.itemiteApiUrl}/user/profile/picture`, {timeout: 10000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async DeleteBackgroundImage() {
    try {
      await lastValueFrom(
        this.http.delete(`${environment.itemiteApiUrl}/user/profile/background`, {timeout: 10000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ChangeEmail(newEmail:string, password:string) {
    const payload = {newEmail: newEmail, password: password};
    try {
      await lastValueFrom(
        this.http.put(`${environment.itemiteApiUrl}/user/settings/change-email`, payload, {timeout: 20000, withCredentials: true})
      );
      return true;
    } catch(error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ConfirmEmail(email: string, token: string): Promise<boolean> {
    const params = new HttpParams()
      .set('email', email)
      .set('token', token);

    try {
      await lastValueFrom(
        this.http.get(`${environment.itemiteApiUrl}/auth/confirm-email`, {params})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ConfirmChangeEmail(token: string, currentEmail: string) {

    const params = new HttpParams()
      .set('currentEmail', currentEmail)
      .set('token', token);

    try {
      await lastValueFrom(
        this.http.get(
          `${environment.itemiteApiUrl}/user/settings/confirm-email-change`,
          {timeout: 10000, withCredentials: true, params: params}
        )
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }
}
