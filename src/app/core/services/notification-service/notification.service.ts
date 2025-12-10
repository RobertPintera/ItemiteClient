import {effect, inject, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalR'
import { environment } from '../../../../environments/environment.development';
import {UserService} from '../user-service/user.service';
import {MessageResponse} from '../../models/chat/MessageResponse';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _hub: signalR.HubConnection;
  private _userService = inject(UserService);

  private _onMessageReceived = new Subject<MessageResponse>();
  get onMessageReceived() { return this._onMessageReceived.asObservable(); }

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
        this._hub.onreconnected(id => this.OnReconnect(id));
        this._hub.onclose(error => this.OnDisconnect(error));
      })
      .catch(err => console.error('Error establishing SignalR for notifications: ' + err));

    this.RegisterMessageEvents();
  }

  private async Disconnect() {
    if(this._hub.connectionId === null) return;

    await this._hub.stop();
  }

  private OnDisconnect(error: Error | undefined) {

  }

  private OnReconnect(id: string | undefined) {

  }

  private RegisterMessageEvents() {
    this._hub.on("MessageResponse", (message: MessageResponse) => {
      this._onMessageReceived.next(message);
    });
  }

  private UnregisterMessageEvents() {
    this._hub.off("MessageResponse");
  }

}
