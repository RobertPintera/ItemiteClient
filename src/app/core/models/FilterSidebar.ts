import {OptionItem} from './OptionItem';
import {Localization} from './Localization';

export interface FilterSidebar {
  categoryIds: number[];
  priceFrom: number | null;
  priceTo: number | null;
  priceError: string | null;
  listingType: OptionItem;
  localizationText: string;
  localization: Localization | null;
  distance: OptionItem;
}
