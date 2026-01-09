import {HttpClient} from '@angular/common/http';
import {
  computed,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {UserBasicInfo} from '../../models/user/UserBasicInfo';
import {filter, interval, lastValueFrom, race, take, timer} from 'rxjs';
import {environment} from '../../../../environments/environment.development';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {User} from '../../models/user/User';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _refreshTokenMinutesSpacing = 10;

  private http: HttpClient = inject(HttpClient);
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  private _isUserLoggedIn = signal<boolean | undefined>(undefined);
  readonly isUserLoggedIn = computed(() => this._isUserLoggedIn() ?? false);

  private _tokenRefreshLoopRunning: boolean = false;

  private _userBasicInfo = signal<UserBasicInfo>(
    {
      id: -1,
      userName: "",
      email: "",
      profilePhotoUrl: null
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
      backgroundUrl: undefined,
      authProvider: '',
      roles: []
    }
  );

  readonly userBasicInfo = this._userBasicInfo.asReadonly();
  readonly userInfo = this._userInfo.asReadonly();
  private _platformId = inject(PLATFORM_ID);

  constructor() {
    if(!isPlatformBrowser(this._platformId)) return;

    effect(() => {
      // This effect is called when refresh tokens loop should run
      // tokenRefreshLoopRunning ensures the loop really stopped
      //    and prevents to run multiple loops
      if(this.isUserLoggedIn() && !this._tokenRefreshLoopRunning) {
        this.PerformContinuesTokenRefresh();
      } else if(!this.isUserLoggedIn()) {
        this.ClearUserInfo();
      }
    });

    this.errorHandlerService.onAccountLockedDetected.subscribe(() => {
      this.Logout();
    });

    this.errorHandlerService.onLoggedOutDetected.subscribe(() => {
      this.ClearUserInfo();
      this._isUserLoggedIn.set(false);
    });
  }

  async ResolveAuth(): Promise<boolean> {
    if(!isPlatformBrowser(this._platformId)) return true;

    if(this._isUserLoggedIn() !== undefined) {
      return this.isUserLoggedIn();
    }

    try {
      const response = await lastValueFrom(
        this.http.get<User>(`${environment.itemiteApiUrl}/user/me`, {withCredentials: true})
      );
      this._userBasicInfo.set({
        id: response.id,
        userName: response.userName,
        email: response.email,
        profilePhotoUrl: response.photoUrl ?? null
      });
      this._userInfo.set(response);
      this._isUserLoggedIn.set(true);
      return true;
    } catch (error: any) {
      this._isUserLoggedIn.set(false);
      return false;
    }
  }

  private ClearUserInfo(): void {
    this._userBasicInfo.set({
      id: -1,
      userName: "",
      email: "",
      profilePhotoUrl: null
    });

    this._userInfo.set({
      backgroundUrl: undefined,
      location: undefined,
      phoneNumber: undefined,
      photoUrl: undefined,
      authProvider: "",
      roles: [],
      userName: '',
      id: -1,
      email: "",
    });
  }

  // Returns true if successfully logged in, otherwise false
  async Login(email: string, password: string): Promise<boolean> {
    const payload = {email: email, password: password};
    try {
      const userInfo = await lastValueFrom(
        this.http.post<UserBasicInfo>(`${environment.itemiteApiUrl}/auth/login`, payload)
      );
      this._isUserLoggedIn.set(true);
      this._userBasicInfo.set(userInfo);
      return true;
    } catch (error: any) {
      this._isUserLoggedIn.set(false);
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
        this.http.post<number>(`${environment.itemiteApiUrl}/auth/register`, payload)
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  // This will need to be recalled once this.autoRefreshToken()
  //  - handled in effect()
  async PerformContinuesTokenRefresh() {
    // Make sure there is only one token refresh loop
    if(this._tokenRefreshLoopRunning) return;

    this._tokenRefreshLoopRunning = true;

    await new Promise(resolve => setTimeout(resolve, 10000));

    while (this.isUserLoggedIn()) {
      if(await this.RefreshToken() == 401) {
        this._isUserLoggedIn.set(false);
        break;
      }

      console.log("Refreshed token");

      const stop = interval(1000).pipe(
        filter(() => !this.isUserLoggedIn()), take(1)
      );

      await lastValueFrom(
        race(
          timer(this._refreshTokenMinutesSpacing * 60 * 1000),
          stop
        )
      );
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
        this._isUserLoggedIn.set(false);
      }

      this.errorHandlerService.SendErrorMessage(error);
      return error.status;
    }
  }

  LoginWithGoogle(): string {
    const params = new URLSearchParams({
      returnUrl: "http://localhost:4200/me",
      failureUrl: "http://localhost:4200/external-login-error"
    });
    return `${environment.itemiteApiUrl}/auth/login/google?${params.toString()}`;
  }

  async Logout(): Promise<boolean> {
    try {
      // Not used but it's returned by the api
      const message = await lastValueFrom(
        this.http.get<string>(`${environment.itemiteApiUrl}/auth/logout`, {timeout: 10000, withCredentials: true})
      );
      this._isUserLoggedIn.set(false);
      this.ClearUserInfo();
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async LogoutAllDevices(): Promise<boolean> {
    try {
      // Not used but it's returned by the api
      const message = await lastValueFrom(
        this.http.get<string>(`${environment.itemiteApiUrl}/auth/logout-all-devices`, {timeout: 10000, withCredentials: true})
      );
      this._isUserLoggedIn.set(false);
      return true;
    } catch (error: any) {
      return false;
    }
  }
}
