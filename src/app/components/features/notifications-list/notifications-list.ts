import {AfterViewInit, Component, computed, inject, PLATFORM_ID, signal} from '@angular/core';
import {NotificationService} from '../../../core/services/notification-service/notification.service';
import {Notification} from '../../../core/models/notification/Notification';
import {isPlatformServer} from '@angular/common';
import {NotificationCard} from './notification-card/notification-card';
import {of} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {LoadingCircle} from '../../shared/loading-circle/loading-circle';
import {UserService} from '../../../core/services/user-service/user.service';
import {ChatMemberInfo} from '../../../core/models/chat/ChatMemberInfo';

@Component({
  selector: 'app-notifications-list',
  imports: [
    NotificationCard,
    TranslatePipe,
    LoadingCircle
  ],
  templateUrl: './notifications-list.html',
  styleUrl: './notifications-list.css',
})
export class NotificationsList implements AfterViewInit {
  private readonly PAGE_SIZE = 20;
  private _totalPages = signal(0);
  readonly totalPages = this._totalPages.asReadonly();
  private _currentPage = signal(0);
  readonly currentPage = this._currentPage.asReadonly();
  private _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();
  private _totalItemsCount = signal(0);
  readonly totalItemsCount = this._totalItemsCount.asReadonly();
  readonly hasItemsOnPage = computed(() =>
    this._notifications().length > 0
  );

  private _notificationService = inject(NotificationService);
  private _platformId = inject(PLATFORM_ID);
  private _userService = inject(UserService);
  private _router = inject(Router);

  private _newMessages = 0;
  private _deletionCount = 0;
  private _ogTotalPages = 0;
  private _ogCurrentPage = 0;

  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();

  constructor() {
    if(isPlatformServer(this._platformId)) return;

    this._notificationService.onNotificationReceived.subscribe(notification => {
      this.RecalculatePages(notification);
    });
  }

  async ngAfterViewInit() {
    await this.ChangePage(1);
  }

  async DeleteAll() {
    this._loading.set(true);
    const success = await this._notificationService.DeleteNotifications();
    this._loading.set(false);
    if(!success) return;

    this._notifications.set([]);
    this._currentPage.set(1);
    this._totalPages.set(1);
    this._ogTotalPages = 1;
    this._ogCurrentPage = 1;
  }

  async DeleteNotification(id: number) {
    const copy = this._notifications().find(value => value.notificationId === id);
    const index = this._notifications().findIndex(value => value.notificationId === id);

    if(copy === undefined || index === -1) return;

    this._notifications.update((notifications) => {
      notifications.splice(
        index,
        1
      )
      return notifications;
    });
    const success = await this._notificationService.DeleteNotification(id);
    if(!success) {
      this._notifications.set([...this._notifications(), copy]);
      return;
    }

    this._deletionCount++;

    if(this._notifications().length !== 0) return;

    // refetch notifications
    await this.ChangePage(Math.max(this._currentPage() - 1, 1));
  }

  LoadPreviousPage() {
    this.ChangePage(this.currentPage() - 1);
  }

  LoadNextPage() {
    this.ChangePage(this.currentPage() + 1);
  }

  private async ChangePage(page: number) {

    // todo call api and load into _ogTotalPages & _ogCurrentPage
    this._loading.set(true);
    const notifications =
      await this._notificationService.FetchNotifications(this.PAGE_SIZE, page);
    this._loading.set(false)

    if(!notifications) return;
    console.log(notifications);

    this._totalItemsCount.set(notifications.totalItemsCount);
    this._notifications.set(notifications.items);

    this._totalPages.set(notifications.totalPages);
    this._currentPage.set(page);
    this._ogTotalPages = notifications.totalPages;
    this._ogCurrentPage = page;

    // Reset counters when page changed
    this._newMessages = 0;
    this._deletionCount = 0;
  }

  private RecalculatePages(newNotif: Notification) {
    if(this.currentPage() <= 1) {
      this._notifications.update((notifications) =>
        [newNotif,...notifications]
      );
      return;
    }

    const shiftDelta =
      this._newMessages - this._deletionCount;

    if(shiftDelta <= 0) return;

    const pageShift = Math.floor(shiftDelta / this.PAGE_SIZE);
    this._currentPage.set(this._ogCurrentPage + pageShift);
    this._totalPages.set(this._ogTotalPages + pageShift);
  }

  async HandleNotificationClick(notificationId: number) {
    const notificationIndex = this._notifications().findIndex(value => value.notificationId === notificationId);
    const notification = this.notifications()[notificationIndex];
    if(notification === undefined) return;

    this.MarkNotificationAsRead(notification, notificationIndex);

    if(notification.resourceType === "Product") {
      this._router.navigate(['product'], {queryParams: {id: notification.listingId, type: "Product"}});
      return;
    }

    if(notification.resourceType === "User") {
      return;
    }

    if(notification.resourceType === "Auction") {
      this._router.navigate(['product'], {queryParams: {id: notification.listingId, type: "Auction"}});
      return;
    }

    if(notification.resourceType === "ChatPage") {
      if(this._userService.userInfo().id === -1) {
        this._loading.set(true);
        const fetchSuccess = await this._userService.FetchCurrentUserInfo();
        this._loading.set(false);
        if(!fetchSuccess) return;
      }

      const chatMembers: ChatMemberInfo[] = [
        {
          id: this._userService.userInfo().id,
          userName: this._userService.userInfo().userName,
          email: this._userService.userInfo().email,
          photoUrl: this._userService.userInfo().photoUrl
        },
        {
          id: notification.userId ?? -1,
          userName: notification.userInfo?.userName ?? "",
          email: "",
          photoUrl: notification.userInfo?.photoUrl
        }
      ];
      const listingId = notification.listingId ?? -1;

      await this._router.navigate(
        ['chat'],
        {state: {
          chatMembers: chatMembers, listingId: listingId}
        }
      );

      return;
    }
  }
  OnCloseClicked() {
    this._notificationService.SetNotificationListVisibility(false);
  }
  MarkNotificationAsRead(notification: Notification, index: number) {
    if(notification.readAt !== null) return;
    notification.readAt = "Now";
    this._notifications.update((notifications) => {
      notifications[index] = notification;
      return notifications;
    });
  }
}
