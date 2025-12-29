import {User} from '../User';

export interface Bid {
  id: number;
  bidder: User;
  bidPrice: number;
  bidDate: string;
}
