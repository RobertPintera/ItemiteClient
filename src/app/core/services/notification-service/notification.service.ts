import {effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import * as signalR from '@microsoft/signalR'
import { environment } from '../../../../environments/environment.development';
import {AuthService} from '../auth-service/auth.service';
import {MessageResponse} from '../../models/chat/MessageResponse';
import {lastValueFrom, Observable, Subject} from 'rxjs';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {TranslateService} from '@ngx-translate/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../../models/user/User';
import {Notification} from '../../models/notification/Notification';
import {NotificationResponseDTO} from '../../models/notification/NotificationResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _userService = inject(AuthService);
  private _notifHub: signalR.HubConnection;
  private _broadcastHub: signalR.HubConnection;
  private _http = inject(HttpClient);
  private _errorService = inject(ErrorHandlerService);

  private _onNotificationReceived = new Subject<Notification>();
  private _onMessageReceived = new Subject<MessageResponse>();
  private _onMessageDeleted = new Subject<number>();
  private _onMessageUpdated = new Subject<MessageResponse>();

  get onMessageReceived() { return this._onMessageReceived.asObservable(); }
  get onMessageDeleted() { return this._onMessageDeleted.asObservable(); }
  get onMessageUpdated() { return this._onMessageUpdated.asObservable(); }
  get onNotificationReceived() { return this._onNotificationReceived.asObservable(); }

  private _notificationCount = signal(0);
  readonly notificationCount = this._notificationCount.asReadonly();

  private _showNotificationList = signal(false);
  readonly showNotificationList = this._showNotificationList.asReadonly();

  private _platformId = inject(PLATFORM_ID);

  constructor() {
    this._notifHub = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.itemiteHubs}/notifications`)
      .withAutomaticReconnect([
        0,
        2000,
        10000,
        30000,
        60000
      ])
      .build();

    this._broadcastHub = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.itemiteHubs}/broadcast`)
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
    this.RegisterNotificationEvent();
    this.RegisterConnectionEvents();
    this.RegisterBroadcastEvents();

    effect(() => {
      if(this._userService.isUserLoggedIn()) {
        this.Connect();
      }
      else {
        this.Disconnect();
        this._showNotificationList.set(false);
        this._notificationCount.set(0);
      }
    });
  }

  private async Connect() {
    if (this._notifHub.state !== signalR.HubConnectionState.Disconnected) return;

    await this.FetchUnreadCount();

    try {
      await this._notifHub.start();
      console.log('SignalR for notification service connected');
    } catch (err) {
      console.error('SignalR start failed', err);
    }
  }

  private async Disconnect() {
    if (this._notifHub.state === signalR.HubConnectionState.Disconnected) return;
    await this._notifHub.stop();
    await this._broadcastHub.stop();
  }

  private RegisterConnectionEvents() {
    this._notifHub.onreconnecting(error => {
      console.log('SignalR for notification service reconnecting...', error);
    });

    this._notifHub.onreconnected(connectionId => {
      console.log('SignalR for notification service reconnected:', connectionId);
      this.FetchUnreadCount();
    });

    this._notifHub.onclose(error => {
      console.log('SignalR for notification service closed', error);
    });

    this._broadcastHub.onreconnecting(error => {
      console.log('SignalR for broadcast service reconnecting...', error);
    });

    this._broadcastHub.onreconnected(connectionId => {
      console.log('SignalR for broadcast service reconnected:', connectionId);
      this.FetchUnreadCount();
    });

    this._broadcastHub.onclose(error => {
      console.log('SignalR for broadcast service closed', error);
    });
  }

  private RegisterNotificationEvent() {
    this._notifHub.on("Notification", (notification: Notification) => {
      this._onNotificationReceived.next(notification);
      this._notificationCount.set(this._notificationCount()+1);
    });
  }

  private RegisterMessageEvents() {
    this._notifHub.on("MessageReceived", (message: MessageResponse) => {
      console.log("Received message")
      console.log(message);
      this._onMessageReceived.next(message);
    });

    this._notifHub.on("MessageUpdated", (message: MessageResponse) => {
      console.log("Edited message");
      console.log(message);
      this._onMessageUpdated.next(message);
    });

    interface MessageDeletedResponse {
      messageId: number,
      messageDeletedString: string
    }

    this._notifHub.on("MessageDeleted", (message: MessageDeletedResponse) => {
      console.log("Deleted message");
      console.log(message);
      this._onMessageDeleted.next(message.messageId);
    })
  }

  private RegisterBroadcastEvents() {
    this._notifHub.on("SiteMessage", (notification: Notification) => {
      this._onNotificationReceived.next(notification);
      this._notificationCount.set(this._notificationCount()+1);
    });
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

  async FetchNotifications(pageSize: number, pageNumber: number)
    : Promise<NotificationResponseDTO | undefined> {

    const params = new HttpParams()
      .set('PageSize', pageSize)
      .set('PageNumber', pageNumber);

    try {
      const notifications = await lastValueFrom(
        this._http.get<NotificationResponseDTO>(`${environment.itemiteApiUrl}/notification`,
          {withCredentials: true, params: params})
      );
      // mark notifications as read
      this.MarkNotificationsAsRead(
        notifications.items.filter((notification: Notification) =>
          notification.readAt === null
        ).length
      );
      return notifications;
    } catch (error: any) {
      this._errorService.SendErrorMessage(error);
      return undefined;
    }
  }

  async DeleteNotification(notificationId:number): Promise<boolean> {
    try {
      await lastValueFrom(
        this._http.delete(`${environment.itemiteApiUrl}/notification/${notificationId}`,
          {withCredentials: true})
      );
      return true;
    } catch (error: any) {
      this._errorService.SendErrorMessage(error);
      return false
    }
  }

  private MarkNotificationsAsRead(count: number) {
    this._notificationCount.set(
      Math.max(this._notificationCount()-count, 0)
    );
  }

  async DeleteNotifications(): Promise<boolean> {
    try {
      await lastValueFrom(
        this._http.delete(`${environment.itemiteApiUrl}/notification`,
          {withCredentials: true})
      );
      this._notificationCount.set(0);
      return true;
    } catch (error: any) {
      this._errorService.SendErrorMessage(error);
      return false
    }
  }

  SetNotificationListVisibility(visible: boolean) {
    this._showNotificationList.set(visible);
  }

  SwitchNotificationVisibility() {
    this._showNotificationList.set(!this.showNotificationList());
  }
}
