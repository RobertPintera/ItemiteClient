import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import {Environment} from '@angular/cli/lib/config/workspace-schema';
import {environment} from '../../../../environments/environment.development';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {SendMessageResultDTO} from '../../models/chat/SendMessageResultDTO';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class MessageService {

  private http = inject(HttpClient);
  private errorHandlerService = inject(ErrorHandlerService);

  SendMessage (
    recipientId:number,
    listingId: number,
    content : string | undefined,
    photos : File[] | undefined
  ):Observable<SendMessageResultDTO> {
    const formData = new FormData();
    formData.append('RecipientId', recipientId.toString());
    formData.append('ListingId', listingId.toString());
    if (content) {
      formData.append("Content", content.toString());
    }
    if (photos && photos.length > 0) {
      photos.forEach((file, index) => {
        formData.append('photos', file, file.name);
      });
    }
    return this.http.post<SendMessageResultDTO>(`${environment.itemiteApiUrl}/message`, formData);
  }
}
