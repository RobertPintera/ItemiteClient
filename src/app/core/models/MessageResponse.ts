export interface MessageResponse {
  messageId: number,
  content: string | undefined,
  dateSent: Date,
  dateModified: Date | undefined,
  dateRead: Date | undefined,
  senderId: number,
  listingId: number,
  recipientId: number,
  photos: Array<MessageResponse>
}
