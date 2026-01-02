import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginatedUsersResponseDTO} from '../../models/user/PaginatedUsersResponseDTO';
import {catchError, lastValueFrom, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment.development';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {PostAdminPanelCategoryResponseDTO} from '../../models/category/PostAdminPanelCategoryResponseDTO';
import {CategoryDTO} from '../../models/category/CategoryDTO';
import {PaymentCountsResponseDTO} from '../../models/payments/PaymentCountsResponseDTO';
import {PostAdminPanelCategoryDTO} from '../../models/category/PostAdminPanelCategoryDTO';
import {DeleteAdminPanelCategoryDTO} from '../../models/category/DeleteAdminPanelCategoryDTO';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _http = inject(HttpClient);
  private _errorHandlerService = inject(ErrorHandlerService);
  private _baseUrl = `${environment.itemiteApiUrl}/adminpanel`;


  // region Categories
  private postAdminPanelCategory(formData: FormData): Observable<PostAdminPanelCategoryResponseDTO> {
    return this._http.post<PostAdminPanelCategoryResponseDTO>(`${this._baseUrl}/category`, formData);
  }

  private putAdminPanelCategory(id: number, formData: FormData): Observable<CategoryDTO> {
    return this._http.put<CategoryDTO>(`${this._baseUrl}/category/${id}`, formData);
  }

  private deleteAdminPanelCategory(id: number, params: HttpParams): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/category/${id}`, { params });
  }

  createCategory(category: PostAdminPanelCategoryDTO): Observable<PostAdminPanelCategoryResponseDTO>{
    const formData = new FormData();
    formData.append('Name', category.name);
    formData.append('Description', category.description);
    if(category.svgImage) formData.append('svgImage', category.svgImage);

    return this.postAdminPanelCategory(formData).pipe(
      catchError(err => {
        this._errorHandlerService.SendErrorMessage(err);
        console.error('Error createCategory:', err);
        throw err;
      })
    );
  }

  updateCategory(id: number, category: PostAdminPanelCategoryDTO) {
    const formData = new FormData();
    formData.append('Name', category.name);
    formData.append('Description', category.description);
    if(category.svgImage) formData.append('svgImage', category.svgImage);

    return this.putAdminPanelCategory(id, formData).pipe(
      catchError(err => {
        this._errorHandlerService.SendErrorMessage(err);
        console.error('Error updateCategory:', err);
        throw err;
      })
    );
  }

  deleteCategory(id: number, settings: DeleteAdminPanelCategoryDTO)
  {
    const params = new HttpParams()
      .set('deleteFullTree', settings.deleteFullTree);

    return this.deleteAdminPanelCategory(id, params).pipe(
      catchError(err => {
        this._errorHandlerService.SendErrorMessage(err);
        console.error('Error deleteCategory:', err);
        throw err;
      })
    );
  }

  // endregion

  //region Listings

  private deleteAdminPanelListing(id: number): Observable<void> {
    return this._http.delete<void>(`${environment.itemiteApiUrl}/${id}`);
  }

  // endregion

  // region Payments

  private getAdminPanelPaymentsWithStatus(params: HttpParams): Observable<PaginatedUsersResponseDTO> {
    return this._http.get<PaginatedUsersResponseDTO>(`${environment.itemiteApiUrl}/payments/with-status`, { params });
  }

  private getAdminPanelPaymentsLatest(params: HttpParams): Observable<PaginatedUsersResponseDTO> {
    return this._http.get<PaginatedUsersResponseDTO>(`${environment.itemiteApiUrl}/payments/latest`, { params });
  }

  private getAdminPanelPaymentsCounts(): Observable<PaymentCountsResponseDTO> {
    return this._http.get<PaymentCountsResponseDTO>(`${environment.itemiteApiUrl}/payments/counts`);
  }

  // endregion

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
