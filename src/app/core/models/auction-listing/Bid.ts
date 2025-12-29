import {User} from '../user/User';

export interface Bid {
  id: number;
  bidder: User;
  bidPrice: number;
  bidDate: string;
}
