// Bulk discount: 10% off orders with 5 or more line items, rounded to the
// nearest cent. Accounts with a negotiated rate are handled by the finance team
// outside this service.
export function priceWithDiscount(subtotalCents, lineItems) {
  if (lineItems >= 5) {
    return Math.floor(subtotalCents * 0.9);
  }
  return subtotalCents;
}
