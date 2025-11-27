import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment.development';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {SendMessageResultDTO} from '../../models/chat/SendMessageResultDTO';
import {ChatListResponseDTO} from '../../models/chat/ChatListResponseDTO';
import {ChatResponseDTO} from '../../models/chat/ChatResponseDTO';
import {MessageResponse} from '../../models/chat/MessageResponse';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class MessageService {

  private http = inject(HttpClient);
  private errorHandlerService = inject(ErrorHandlerService);

  // region general chat queries
  GetAllChats(
    pageNumber: number,
    pageSize: number = 10,
  ): Observable<ChatListResponseDTO> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<ChatListResponseDTO>(`${environment.itemiteApiUrl}/message/chats`, {params:params, timeout: 15000, withCredentials: true});
  }

  GetChatsByListing(
    listingId: number,
    pageNumber: number,
    pageSize: number = 10,
  ): Observable<ChatListResponseDTO> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<ChatListResponseDTO>(`${environment.itemiteApiUrl}/message/${listingId}/chats`, {params:params, timeout: 15000, withCredentials: true});
  }

  GetChat(
    listingId: number,
    otherUserId: number,
    pageNumber: number,
    pageSize: number = 20,
  ): Observable<ChatResponseDTO> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<ChatResponseDTO>(`${environment.itemiteApiUrl}/message/${listingId}/chats/${otherUserId}`, {params:params, timeout: 15000, withCredentials: true});
  }
  // endregion

  // region message operations
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
    return this.http.post<SendMessageResultDTO>(`${environment.itemiteApiUrl}/message`, formData, {withCredentials: true});
  }

  EditMessage(
    messageId: number,
    newContent : string,
  ): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${environment.itemiteApiUrl}/message/${messageId}`, newContent, {timeout: 15000, withCredentials: true});
  }

  async DeleteMessage(
    messageId: number
  ) : Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.delete(`${environment.itemiteApiUrl}/message/${messageId}`, {timeout: 15000, withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this.errorHandlerService.SendErrorMessage(error);
      return false;
    }
  }
  // endregion
}
