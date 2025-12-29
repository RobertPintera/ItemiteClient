import {NotificationUserInfo} from './NotificationUserInfo';
import {ResourceType} from '../../constants/constants';

export interface Notification {
  notificationId: number,
  message: string,
  notificationImageUrl: string,
  userId: number | null,
  userInfo: NotificationUserInfo | null,
  listingId: number | null,
  resourceType: ResourceType,
  notificationSent: string,
  readAt: string | null
}
