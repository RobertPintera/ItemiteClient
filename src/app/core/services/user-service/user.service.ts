import { HttpClient } from '@angular/common/http';
import {computed, Injectable, Signal, signal} from '@angular/core';
import {UserBasicInfo} from '../../models/UserBasicInfo';
import {lastValueFrom, map, Observable} from 'rxjs';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {environment} from '../../../../environments/environment';

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
  readonly isUserLoggedIn = computed(() => this._userBasicInfo().id !== -1);


  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) {
  }

  // Returns true if successfully logged in, otherwise false
  async Login(email: string, password: string) : Promise<boolean> {
    const payload = {email: email, password: password};
    try {
      const userInfo = await lastValueFrom(
        this.http.post<UserBasicInfo>(`${environment.itemiteApiUrl}/api/auth/login`, payload, {timeout: 3000})
      );
      this._userBasicInfo.set(userInfo);
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }
}
