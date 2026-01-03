export const DEFAULT_PROFILE_IMAGE = 'assets/images/default_profile_pic.png';

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

export const RESOURCE_TYPE = {
  AUCTION: 'Auction',
  PRODUCT: 'Product',
  USER: 'User',
  CHAT_PAGE: 'ChatPage'
} as const;

export type ResourceType = typeof RESOURCE_TYPE[keyof typeof RESOURCE_TYPE];

export const PAYMENT_STATUS = {
  AUTHORIZED: 'Authorized',
  PENDING_CAPTURE: 'Pending capture',
  OUTBID: "Outbid",
  PENDING: "Pending",
  PENDING_REVIEW: "Pending review",
  TRANSFERRED: "Transferred",
  REFUND_SCHEDULED: "Refund scheduled",
  PARTIAL_REFUND_SCHEDULED: "Partial refund scheduled",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially refunded",
  DISPUTED: "Disputed",
  FAILED: "Failed",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const DISPUTE_RESOLUTION = {
  REFUND_BUYER: 'RefundBuyer',
  DECLINED: 'Declined',
  PARTIAL_REFUND: 'PartialRefund'
} as const;

export type DisputeResolution = (typeof DISPUTE_RESOLUTION)[keyof typeof DISPUTE_RESOLUTION];

export const BANNER_POSITION = {
  LEFT: "Left",
  RIGHT: "Right",
  TOP: "Top",
  BOTTOM: "Bottom",
} as const;

export type BannerPosition = (typeof BANNER_POSITION)[keyof typeof BANNER_POSITION];

export const PAYMENT_TYPE = {
  LATEST: 'Latest',
  WITH_STATUS: 'With status',
} as const;

export type PaymentType = (typeof PAYMENT_TYPE)[keyof typeof PAYMENT_TYPE];
