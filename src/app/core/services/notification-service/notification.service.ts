import {effect, inject, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalR'
import { environment } from '../../../../environments/environment.development';
import {UserService} from '../user-service/user.service';
import {MessageResponse} from '../../models/chat/MessageResponse';
import {Observable, Subject} from 'rxjs';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // todo maybe keep retrying to connect back to hub

  private _userService = inject(UserService);
  private _hub: signalR.HubConnection;

  private _onMessageReceived = new Subject<MessageResponse>();
  private _onMessageDeleted = new Subject<number>();
  private _onMessageUpdated = new Subject<MessageResponse>();

  get onMessageReceived() { return this._onMessageReceived.asObservable(); }
  get onMessageDeleted() { return this._onMessageDeleted.asObservable(); }
  get onMessageUpdated() { return this._onMessageUpdated.asObservable(); }

  constructor() {
    this._hub = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.itemiteHubs}/notifications`)
      .build();

    effect(() => {
      if(this._userService.isUserLoggedIn()) {
        this.Connect();
      }
      else {
        this.Disconnect();
      }
    });
  }

  private async Connect() {
    if(this._hub.connectionId !== null) return;

    // wait for cookies to set
    await new Promise(resolve => setTimeout(resolve, 1000));

    this._hub.start()
      .then(() => {
        console.log('SignalR Connection for notification service started');
        this._hub.onclose(error => this.OnDisconnect(error));
        this._hub.onreconnected(()=>this.OnReconnect());
      })
      .catch(err => console.error('Error establishing SignalR for notifications: ' + err));

    this.RegisterMessageEvents();
  }

  private async Disconnect() {
    if(this._hub.connectionId === null) return;
    await this._hub.stop();
  }

  private OnDisconnect(error: Error | undefined) {
    this.UnregisterMessageEvents();
  }

  private OnReconnect() {
    this.UnregisterMessageEvents();
    console.log('SignalR Reconnected for notification service');
    this.RegisterMessageEvents();
  }


  private RegisterMessageEvents() {
    this._hub.on("MessageReceived", (message: MessageResponse) => {
      console.log("Received message: " + message)
      this._onMessageReceived.next(message);
    });

    this._hub.on("MessageUpdated", (message: MessageResponse) => {
      console.log("Edited message: " + message);
      this._onMessageUpdated.next(message);
    });

    interface MessageDeletedResponse {
      messageId: number,
      messageDeletedString: string
    }

    this._hub.on("MessageDeleted", (message: MessageDeletedResponse) => {
      console.log("Deleted message: " + message);
      this._onMessageDeleted.next(message.messageId);
    })
  }

  private UnregisterMessageEvents() {
    this._hub.off("MessageReceived");
    this._hub.off("MessageUpdated");
    this._hub.off("MessageDeleted");
  }

}
