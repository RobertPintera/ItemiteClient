import {Component, computed, inject, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {TextIconMenuItem} from './text-icon-menu-item/text-icon-menu-item';
import {UserService} from '../../../core/services/user-service/user.service';
import {AuthService} from '../../../core/services/auth-service/auth.service';
import {NotificationService} from '../../../core/services/notification-service/notification.service';

@Component({
  selector: 'app-on-profile-menu',
  imports: [
    TranslatePipe,
    TextIconMenuItem
  ],
  templateUrl: './on-profile-menu.html',
  styleUrl: './on-profile-menu.css',
})
export class OnProfileMenu {
  visible = input<boolean>(true);
  onClose = output<void>();


  private _authService = inject(AuthService);
  private _notificationService = inject(NotificationService);

  readonly notificationCount = computed(() =>
    this._notificationService.notificationCount()
  );

  OnMenuItemClicked() {
    this.onClose.emit();
  }

  OnNotificationsClicked() {
    this.OnMenuItemClicked();
  }

  async OnLogoutClicked() {
    this.OnMenuItemClicked();
    await this._authService.Logout();
  }
}
