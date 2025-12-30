import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginatedUsersResponseDTO} from '../../models/user/PaginatedUsersResponseDTO';
import {lastValueFrom, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment.development';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _http = inject(HttpClient);
  private _errorHandlerService = inject(ErrorHandlerService);

  // region Users
  GetUsers(pageNumber: number, searchQuery: string | undefined = undefined, pageSize: number = 10): Observable<PaginatedUsersResponseDTO> {
    let params = new HttpParams()
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);
    if(searchQuery) {
      params = params.append('Search', searchQuery);
    }
    return this._http.get<PaginatedUsersResponseDTO>(`${environment.itemiteApiUrl}/adminpanel/users`, {params:params, timeout: 15000, withCredentials: true})
  }

  async LockUser(userId: number, lockoutEnd: string, lockoutMessage: string): Promise<boolean> {
    const payload = {
      userToLockoutId: userId,
      lockoutEnd: lockoutEnd,
      lockoutMessage: lockoutMessage
    }
    try {
      await lastValueFrom(
        this._http.post(`${environment.itemiteApiUrl}/adminpanel/lock-user`, payload, {timeout: 15000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this._errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  async UnlockUser(userId: number, unlockMessage: string): Promise<boolean> {
    const payload = {
      userId: userId,
      unlockMessage: unlockMessage
    }
    try {
      await lastValueFrom(
        this._http.post(`${environment.itemiteApiUrl}/adminpanel/unlock-user`, payload, {timeout: 15000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this._errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }
  // endregion

  // region Notifications
  async SendGlobalNotification(emailSubject: string, title: string, message: string): Promise<boolean> {
    const payload = {
      emailSubject: emailSubject,
      title: title,
      message: message
    }
    try {
      await lastValueFrom(
        this._http.post(`${environment.itemiteApiUrl}/adminpanel/global-notification`, payload, {timeout: 15000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this._errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }
  async SendNotification(userId: number, emailSubject: string, title: string, message: string): Promise<boolean> {
    const payload = {
      emailSubject: emailSubject,
      title: title,
      message: message
    }
    try {
      await lastValueFrom(
        this._http.post(`${environment.itemiteApiUrl}/adminpanel/notification/${userId}`, payload, {
          timeout: 15000,
          withCredentials: true
        })
      );
      return true;
    } catch (error: any) {
      this._errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }

  // endregion

}
