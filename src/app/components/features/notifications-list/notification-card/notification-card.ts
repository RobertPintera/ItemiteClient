import {Component, input, output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {NotificationType} from '../../../../core/constants/constants';

@Component({
  selector: 'app-notification-card',
  imports: [
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.css',
})
export class NotificationCard {
  readonly notificationId = input<number>(0);
  readonly message = input<string>("Received Notification");
  readonly notificationImageUrl = input<string | undefined>();
  readonly resourceType = input<NotificationType>("Product");
  readonly notificationSent = input<string>("now");
  readonly readAt = input<string | null>(null);

  onClicked = output<number>();
  onDeleted = output<number>();

  OnClicked() {
    this.onClicked.emit(this.notificationId());
  }

  OnDeleteClicked() {
    this.onDeleted.emit(this.notificationId());
  }
}
