export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];

export const LISTING_TYPES = {
  AUCTION: 'Auction',
  PRODUCT: 'Product',
} as const;

export type ListingType = (typeof LISTING_TYPES)[keyof typeof LISTING_TYPES];

export const SORTS_BY = {
  PRICE: "Price",
  CREATIONDATE: "Date of issue",
  VIEWS: "Views"
};

export type SortBy = (typeof SORTS_BY)[keyof typeof SORTS_BY];

export const SORT_DIRECTION = {
  ASCENDING: 'ASCENDING',
  DESCENDING: 'DESCENDING',
} as const;

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
