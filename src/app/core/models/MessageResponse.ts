import {PhotoResponseDTO} from './PhotoResponseDTO';

export interface MessageResponse {
  messageId: number,
  content: string | undefined,
  dateSent: string,
  dateModified: string | undefined,
  dateRead: string | undefined,
  senderId: number,
  listingId: number,
  recipientId: number,
  photos: Array<PhotoResponseDTO>
}
