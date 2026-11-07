# Registration and bank activation: evidence checkpoint

The supplied message refers to a receipt verifier and 25 test groups. Neither
that package nor a 0.01 GEL bank-activation integration was located in the current
official project. Those tests have not been rerun or accepted as verified here.

Confirmed existing code: CORE registration service and transactional identity
allocation exist. Account creation is not evidence of a bank settlement or paid
Coin activation. The UI now says Create account and explicitly separates payment
and activation from registration, in Georgian, English and Russian.

No new payment requirement was imposed on existing accounts. No bank transfer,
webhook, production payment or activation was attempted. No database was changed.

Required before integration:
- Existing receipt-verifier source and its tests.
- Selected bank/PSP and official current integration contract.
- Server-side merchant configuration and approved beneficiary account, supplied
  through the deployment secret mechanism rather than chat or Git.
- Approved activation policy, amounts/currency, legal-document versions, refund
  behavior and Founding cohort rules; keep account creation separate from payment.
- Test credentials and test cases for signed notifications, settlement lookup,
  retries, unique transaction binding, amount mismatch, reversals and duplicates.

Acceptance target remains pending: one authorized test identity -> verified bank
event -> one auditable activation, with replay/concurrency and reversal tests.
An uploaded receipt image or browser success screen alone is not that evidence.

The supplied Renaissance image is an architectural reference. Embedded live
prices, material certifications, 8K silver, environmental claims and 1 Coin = 1 kg
captions are not adopted as verified data or overriding commercial policy.

Changes are local only; this checkpoint does not update the previously pushed
GitHub commit or the production site.
