import {NotificationUserInfo} from './NotificationUserInfo';

export interface Notification {
  notificationId: number,
  message: string,
  notificationImageUrl: string,
  userId: number | null,
  userInfo: NotificationUserInfo | null,
  listingId: number | null,
  resourceType: "Auction" | "Product" | "User" | "ChatPage",
  notificationSent: string,
  readAt: string | null
}
