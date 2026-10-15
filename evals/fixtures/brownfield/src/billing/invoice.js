// Invoices go to the account's billing email.
export function invoiceAddress(account) {
  return account.billingEmail ?? account.email;
}
