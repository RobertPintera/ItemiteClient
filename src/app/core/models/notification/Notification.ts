export interface Notification {
  notificationId: number,
  message: string,
  notificationImageUrl: string,
  resourceId: number,
  resourceType: "Auction" | "Product" | "User" | "ChatPage",
  notificationSent: string,
  readAt: string | undefined
}
