import {HttpClient, HttpParams} from '@angular/common/http';
import {computed, effect, inject, Injectable, OnInit, Signal, signal} from '@angular/core';
import {UserBasicInfo} from '../../models/UserBasicInfo';
import {filter, interval, lastValueFrom, map, Observable, race, take, takeWhile, timer} from 'rxjs';
import {environment} from '../../../../environments/environment.development';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {User} from '../../models/User';
import {clearTimeout} from 'node:timers';
import {subscribe} from 'node:diagnostics_channel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userBasicInfo = signal<UserBasicInfo>(
    {
      id: -1,
      username: "",
      email: ""
    }
  );
  private _userInfo = signal<User>(
    {
      id: -1,
      userName: '',
      email: '',
      location: undefined,
      phoneNumber: undefined,
      photoUrl: undefined,
      backgroundUrl: undefined
    }
  );

  readonly userBasicInfo: Signal<UserBasicInfo> = this._userBasicInfo.asReadonly();
  readonly userInfo: Signal<User> = this._userInfo.asReadonly();
  readonly isUserLoggedIn = computed(() =>
    this._userBasicInfo().id !== -1.
    && this._userBasicInfo().username !== ""
    && this._userBasicInfo().email !== ""
  );

  // Token refresh
  private readonly _refreshTokenMinutesSpacing: number = 10;
  private _tokenRefreshLoopRunning: boolean = false;

  private http: HttpClient = inject(HttpClient);
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  constructor() {
    effect(() => {
      // This effect is called when refresh tokens loop should run
      // tokenRefreshLoopRunning ensures the loop really stopped
      //    and prevents to run multiple loops
      if(this.isUserLoggedIn() && !this._tokenRefreshLoopRunning) {
        this.PerformContinuesTokenRefresh();
      }
    });
    this.OnServiceEnter();
  }

  // Returns true if successfully logged in, otherwise false
  async Login(email: string, password: string): Promise<boolean> {
    const payload = {email: email, password: password};
    try {
      const userInfo = await lastValueFrom(
        this.http.post<UserBasicInfo>(`${environment.itemiteApiUrl}/auth/login`, payload, {timeout: 10000, withCredentials: true})
      );
      this._userBasicInfo.set(userInfo);
      return true;
    } catch (error: any) {
      this.ClearUserInfo();
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async Register(username: string, email: string, password: string, phoneNumber: string | undefined): Promise<boolean> {
    const payload = phoneNumber ?
      {userName: username, email: email, password: password, phoneNumber: phoneNumber} :
      {userName: username, email: email, password: password};
    try {
      const userId = await lastValueFrom(
        this.http.post<number>(`${environment.itemiteApiUrl}/auth/register`, payload, {timeout: 10000})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async OnServiceEnter() {

    // Check if cookies are set, valid and user is logged in
    await this.FetchCurrentUserInfo();
    console.log(this.userBasicInfo());
  }

  // This will need to be recalled once this.autoRefreshToken()
  //  - handled in effect()
  async PerformContinuesTokenRefresh() {
    // Make sure there is only one token refresh loop
    if(this._tokenRefreshLoopRunning) return;

    this._tokenRefreshLoopRunning = true;
    while (this.isUserLoggedIn()) {
      if(await this.RefreshToken() == 401) {
        this.ClearUserInfo();
        break;
      }

      const stop = interval(1000).pipe(
        filter(() => !this.isUserLoggedIn()), take(1)
      );

      await lastValueFrom(
        race(
          timer(this._refreshTokenMinutesSpacing * 60 * 1000),
          stop
        )
      );
      console.log("Refreshed token");
    }
    this._tokenRefreshLoopRunning = false;
  }

  private async RefreshToken() : Promise<number> {
    try {
      const userInfo = await lastValueFrom(
        this.http.post<UserBasicInfo>(`${environment.itemiteApiUrl}/auth/refresh`, {}, {timeout: 10000, withCredentials: true})
      );
      this._userBasicInfo.set(userInfo);
      return 200;
    } catch (error: any) {

      // when token expired or is no longer valid
      if(error.status === 401) {
        console.warn("Clearing user info after token refresh returned 401");
        this.ClearUserInfo();
      }

      this.errorHandlerService.SendErrorMessage(error);
      return error.status;
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

  async ChangePassword(email: string, password: string, token: string): Promise<boolean> {
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

  LoginWithGoogle(): string {
    const params = new URLSearchParams({
      returnUrl: "http://localhost:4200/me",
      failureUrl: "http://localhost:4200/external-login-error"
    });
    return `${environment.itemiteApiUrl}/auth/login/google?${params.toString()}`;
  }

  // This function won't trigger error notification
  //  it's intentional
  async FetchCurrentUserInfo(): Promise<boolean> {
    try {
      this._userInfo.set(
        await lastValueFrom(
          this.http.get<User>(`${environment.itemiteApiUrl}/user/me`, {withCredentials: true}))
      );
      this._userBasicInfo.set(
        {
          id: this.userInfo().id,
          username: this.userInfo().userName,
          email: this.userInfo().email
        }
      );
      return true;
    } catch (error: any) {
      // User is no longer logged-in
      if(error.status == 401) {
        this.ClearUserInfo();
      }
      return false;
    }
  }

  async Logout(): Promise<boolean> {
    try {
      // Not used but it's returned by the api
      const message = await lastValueFrom(
        this.http.get<string>(`${environment.itemiteApiUrl}/auth/logout`, {timeout: 10000, withCredentials: true})
      );
      this.ClearUserInfo();
      return true;
    } catch (error: any) {
      this.ClearUserInfo();
      return false;
    }
  }

  private ClearUserInfo(): void {
    this._userBasicInfo.set({
      id: -1,
      username: "",
      email: ""
    });
    this._userInfo.set({
      id: -1,
      userName: '',
      email: '',
      location: undefined,
      phoneNumber: undefined,
      photoUrl: undefined,
      backgroundUrl: undefined
    })
  }

}
