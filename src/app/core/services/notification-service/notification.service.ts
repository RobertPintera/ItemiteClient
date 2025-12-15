import {effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import * as signalR from '@microsoft/signalR'
import { environment } from '../../../../environments/environment.development';
import {AuthService} from '../auth-service/auth.service';
import {MessageResponse} from '../../models/chat/MessageResponse';
import {lastValueFrom, Observable, Subject} from 'rxjs';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {TranslateService} from '@ngx-translate/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {User} from '../../models/User';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _userService = inject(AuthService);
  private _hub: signalR.HubConnection;
  private _http = inject(HttpClient);

  private _onMessageReceived = new Subject<MessageResponse>();
  private _onMessageDeleted = new Subject<number>();
  private _onMessageUpdated = new Subject<MessageResponse>();

  get onMessageReceived() { return this._onMessageReceived.asObservable(); }
  get onMessageDeleted() { return this._onMessageDeleted.asObservable(); }
  get onMessageUpdated() { return this._onMessageUpdated.asObservable(); }

  private _notificationCount = signal(3);
  readonly notificationCount = this._notificationCount.asReadonly();

  private _platformId = inject(PLATFORM_ID);

  constructor() {
    this._hub = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.itemiteHubs}/notifications`)
      .withAutomaticReconnect([
        0,
        2000,
        10000,
        30000,
        60000
      ])
      .build();

    if(isPlatformServer(this._platformId)) return;

    this.RegisterMessageEvents();
    this.RegisterConnectionEvents();

    effect(() => {
      if(this._userService.isUserLoggedIn()) {
        this.Connect();
      }
      else {
        this.Disconnect();
        this._notificationCount.set(0);
      }
    });
  }

  private async Connect() {
    if (this._hub.state !== signalR.HubConnectionState.Disconnected) return;

    await this.FetchUnreadCount();

    try {
      await this._hub.start();
      console.log('SignalR for notification service  connected');
    } catch (err) {
      console.error('SignalR start failed', err);
    }
  }

  private async Disconnect() {
    if (this._hub.state === signalR.HubConnectionState.Disconnected) return;
    this.UnregisterMessageEvents();
    await this._hub.stop();
  }

  private RegisterConnectionEvents() {
    this._hub.onreconnecting(error => {
      console.log('SignalR for notification service reconnecting...', error);
    });

    this._hub.onreconnected(connectionId => {
      console.log('SignalR for notification service reconnected:', connectionId);
      this.FetchUnreadCount();
    });

    this._hub.onclose(error => {
      console.log('SignalR for notification service closed', error);
    });
  }

  private RegisterMessageEvents() {
    this._hub.on("MessageReceived", (message: MessageResponse) => {
      console.log("Received message")
      console.log(message);
      this._onMessageReceived.next(message);
    });

    this._hub.on("MessageUpdated", (message: MessageResponse) => {
      console.log("Edited message");
      console.log(message);
      this._onMessageUpdated.next(message);
    });

    interface MessageDeletedResponse {
      messageId: number,
      messageDeletedString: string
    }

    this._hub.on("MessageDeleted", (message: MessageDeletedResponse) => {
      console.log("Deleted message");
      console.log(message);
      this._onMessageDeleted.next(message.messageId);
    })
  }

  private async FetchUnreadCount() {
    interface notificationCountResponseDTO {
      unreadNotificationsCount: number
    }
    try {
      await lastValueFrom(
        this._http.get<notificationCountResponseDTO>(`${environment.itemiteApiUrl}/notification/unread-count`,
          {withCredentials: true})
      ).then(value => {
        this._notificationCount.set(value.unreadNotificationsCount);
      });
      return true;
    } catch (error: any) {
      return false;
    }
  }



  private UnregisterMessageEvents() {
    this._hub.off("MessageReceived");
    this._hub.off("MessageUpdated");
    this._hub.off("MessageDeleted");
  }

}
