export interface PaymentCountsResponseDTO {
  statusCounts: {
    "Transferred": number,
    "Disputed": number,
    "Pending": number,
    "Authorized": number,
    "PendingCapture": number,
    "Outbid": number,
    "PendingReview": number,
    "RefundScheduled": number,
    "PartialRefundScheduled": number,
    "Refunded": number,
    "PartiallyRefunded": number,
    "Failed": number
  },
  totalPayments: number
}
