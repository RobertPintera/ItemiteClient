import {OptionItem} from '../OptionItem';
import {Localization} from '../location/Localization';

export interface ListingFilter {
  pageSize: number;
  pageNumber: number;
  categoryIds: number[];
  priceFrom: number | null;
  priceTo: number | null;
  priceError: string | null;
  listingType: OptionItem;
  localization: Localization | null;
  distance: OptionItem;
  localizationText: string;
  sortDirection: OptionItem;
  sortBy: OptionItem;
}
