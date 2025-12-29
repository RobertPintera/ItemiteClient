import {NotificationUserInfo} from './NotificationUserInfo';
import {NotificationType} from '../../constants/constants';

export interface Notification {
  notificationId: number,
  message: string,
  notificationImageUrl: string,
  userId: number | null,
  userInfo: NotificationUserInfo | null,
  listingId: number | null,
  resourceType: NotificationType,
  notificationSent: string,
  readAt: string | null
}
