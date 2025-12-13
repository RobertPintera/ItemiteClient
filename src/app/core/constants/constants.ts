export const BUTTON_SEVERITY = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DISABLED: 'disabled',
  DANGER: 'danger',
  ACCENT: 'accent',
} as const;

export type ButtonSeverity = typeof BUTTON_SEVERITY[keyof typeof BUTTON_SEVERITY];

export const BUTTON_VARIANTS = {
  FILLED: 'filled',
  OUTLINED: 'outlined',
};

export type ButtonVariants = typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];

export const LISTING_TYPES = {
  AUCTION: 'Auction',
  PRODUCT: 'Product',
} as const;

export type ListingType = (typeof LISTING_TYPES)[keyof typeof LISTING_TYPES];

export const SORTS_BY = {
  PRICE: "Price",
  CREATION_DATE: "CreationDate",
  VIEWS: "Views"
};

export type SortBy = (typeof SORTS_BY)[keyof typeof SORTS_BY];

export const SORT_DIRECTION = {
  ASCENDING: 'Ascending',
  DESCENDING: 'Descending',
} as const;

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
