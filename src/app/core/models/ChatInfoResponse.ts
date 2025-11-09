import { ChatMemberInfo } from './ChatMemberInfo';
import {LastMessageInfo} from './LastMessageInfo';
import {ListingBasicInfo} from './ListingBasicInfo';

export interface ChatInfoResponse {
  listing: ListingBasicInfo
  unreadMessagesCount: number,
  lastMessage: LastMessageInfo,
  members: Array<ChatMemberInfo>
}
