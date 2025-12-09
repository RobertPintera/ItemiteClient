import {MessageResponse} from './MessageResponse';

export interface ChatResponseDTO {
  items: MessageResponse[],
  nextCursor: string |  undefined,
  count: number
  limit: number
  hasMore: boolean,
}
