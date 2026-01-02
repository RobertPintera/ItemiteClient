import {inject, Injectable} from '@angular/core';
import {ResourceType} from '../../constants/constants';
import {SendMessageResultDTO} from '../../models/chat/SendMessageResultDTO';
import {environment} from '../../../../environments/environment.development';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {ChatResponseDTO} from '../../models/chat/ChatResponseDTO';
import {ReportListResponseDTO} from '../../models/reports/ReportListResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private _http = inject(HttpClient);
  private _errorHandler = inject(ErrorHandlerService);

  async Report(
    content: string,
    resourceType: ResourceType,
    images: File[] | undefined
  ): Promise<boolean> {
    const formData = new FormData();
    formData.append('Content', content.toString());
    formData.append('ResourceType', resourceType.toString());
    if (images && images.length > 0) {
      images.forEach((file, index) => {
        formData.append('images', file, file.name);
      });
    }
    try {
      const response = await lastValueFrom(
        this._http.post(`${environment.itemiteApiUrl}/report`, formData, {withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this._errorHandler.SendErrorMessage(error);
      return false;
    }
  }

  GetReports(
    pageNumber: number,
    resourceType: ResourceType | undefined,
    pageSize: number = 20,
  ): Observable<ReportListResponseDTO> {
    let params = new HttpParams()
      .set('PageSize', pageSize)
      .set('PageNumber', pageNumber);
    if(resourceType) {
      params = params.append('ResourceType', resourceType.toString());
    }
    return this._http.get<ReportListResponseDTO>(`${environment.itemiteApiUrl}/adminpanel/reports`, {params:params, timeout: 15000, withCredentials: true});
  }
}
