import {HttpClient, HttpParams} from '@angular/common/http';
import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {UserBasicInfo} from '../../models/UserBasicInfo';
import {lastValueFrom, map, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment.development';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userBasicInfo = signal<UserBasicInfo>(
    {
      id : -1,
      username : "",
      email: ""
    }
  );
  readonly userBasicInfo: Signal<UserBasicInfo> = this._userBasicInfo.asReadonly();
  readonly isUserLoggedIn = computed(() =>
    this._userBasicInfo().id !== -1.
    && this._userBasicInfo().username !== ""
    && this._userBasicInfo().email !== ""
  );

  private http: HttpClient = inject(HttpClient);
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  // Returns true if successfully logged in, otherwise false
  async Login(email: string, password: string) : Promise<boolean> {
    const payload = {email: email, password: password};
    try {
      const userInfo = await lastValueFrom(
        this.http.post<UserBasicInfo>(`${environment.itemiteApiUrl}/auth/login`, payload, {timeout: 3000})
      );
      this._userBasicInfo.set(userInfo);
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async Register(username: string, email: string, password: string, phoneNumber: string | undefined) : Promise<boolean> {
    const payload = phoneNumber ?
      {userName: username, email: email, password: password, phoneNumber: phoneNumber} :
      {userName: username, email: email, password: password};
    try {
      const userId = await lastValueFrom(
        this.http.post<number>(`${environment.itemiteApiUrl}/auth/register`, payload, {timeout: 3000})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ConfirmEmail(email:string, token: string) : Promise<boolean> {
    const params = new HttpParams()
      .set('email', email)
      .set('token', token);

    console.log(params);
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

  async RequestPasswordReset(email:string) : Promise<boolean> {
    const payload = {email:email};
    try {
      await lastValueFrom(
        this.http.post(`${environment.itemiteApiUrl}/auth/forgot-password`, payload, {timeout: 3000})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async ChangePassword(email: string, password: string, token: string) : Promise<boolean> {
    const payload = {email: email, password: password, token: token};
    try {
      await lastValueFrom(
        this.http.post(`${environment.itemiteApiUrl}/auth/reset-password  `, payload, {timeout: 3000})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

}
