export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];

export const LISTING_TYPES = {
  AUCTION: 'auction',
  PRODUCT: 'product',
} as const;

export type ListingType = (typeof LISTING_TYPES)[keyof typeof LISTING_TYPES];

export const SORTS_BY = {
  PRICE: "price",
  CREATION_DATE: "creationDate",
  VIEWS: "views"
};

export type SortBy = (typeof SORTS_BY)[keyof typeof SORTS_BY];

export const SORT_DIRECTION = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
} as const;

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
