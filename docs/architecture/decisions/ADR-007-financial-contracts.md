# ADR-007 — Decimal money, quote lifetime and immutable snapshots

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Finance/Product + Backend; Legal for applicable obligations; named individual/signature NOT RECORDED.
Gate: FIN-01 / FIN-02 / LEG-01 / DB-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-02 M prices; CH-06 QUOTE, CH-07 PERSIST/ORDER and later CH-16 refunds. Sources: architecture §8, database §§6–10/16, API §§2/6/17; PRD pricing/financial scope; BA-15/21.

API authority, decimal arithmetic, NUMERIC persistence, decimal-string money with EGP in P0, rule versions and immutable order/item/address/financial snapshots are fixed constraints. Tax treatment, rounding/scale/range, shipping and quote expiry values are not approved examples.

## Options and trade-offs

A: separate internal calculation and settlement scales: preserves intermediate detail, but allocation/reconciliation rules become more involved. B: one reviewed scale throughout: simpler audit paths, but repeated rounding can differ. Line-level versus invoice-level rounding and inclusive versus exclusive tax need Finance decisions and golden invoices; no option selects a statutory rate or zero tax.

## Recommendation and owner decision

Approve an ordered calculation/allocation specification and golden fixtures before choosing precision, DB columns or arithmetic library behavior. Keep EGP-only P0 and persisted rule/snapshot versions. Define quote expiry separately from reservation TTL, including repricing, address/shipping change and reconfirmation rules with INV/PAY owners. No numeric policy is selected.

## Security and operational effects

Bound quantities/amounts and reject browser financial authority. Record exact rule versions and compensating adjustments. Qualified Legal/Finance must settle tax/shipping/invoice obligations; this pack supplies no legal interpretation. Refund never implies physical return or restock.

## API and database effects

API decimal strings and canonical amounts must align with reviewed NUMERIC constraints, zero-price policy and snapshot fields. FIN-02 later settles eligibility/window, capture including in-flight refund ceilings, allocation, approval separation and failures. Do not create refund schemas/effects or multi-currency prerequisites in P0.

## Evidence, approval and reversal

FIN-01 decision requires explicit scale/range, rounding stages, tax/shipping basis and golden edge invoices (ties, allocations, large/zero amounts); later implementation proves exact arithmetic. FIN-02 packet is deferred to RETURNS/MOCK_REFUND with concurrent partial-refund fixtures and eligible-capture proof. Reopen on promotions (FIN-01 revision), currency or tax/shipping rules.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).
