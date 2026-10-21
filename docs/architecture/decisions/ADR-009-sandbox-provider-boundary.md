# ADR-009 — Sandbox adapter, provider evidence and deferred live activation

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Product/Payments + Finance/Legal/Security/Operations; named individual/signature NOT RECORDED.
Gate: PAY-01 / OPS-01 / PAY-LIVE / FIN-02 / LEG-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-08 MOCK now; CH-19 PROVIDER_REVIEW/LIVE and CH-16 MOCK_REFUND later. Sources: architecture §§10.3–10.5/14, API §§7/11/17; BA-21/25.

P0 is mock/sandbox only. No Egyptian provider or live credentials selected. Signed external events and backend authority remain required even for sandbox acceptance; refunds/restock are separate effects.

## Options and trade-offs

A: deterministic in-process mock adapter with fixed reviewed scenario fixtures: portable and no hosted spend, but cannot certify a real provider. B: vendor sandbox adapter: realistic provider semantics, but requires commercial/security/custody approval and external access. Test-only signed simulation ingress and production-safe portfolio mock purchase flows need distinct exposure rules.

## Recommendation and owner decision

Prefer deterministic mock boundaries for P0 after PAY-01 approves scenarios and environment allowlists; leave vendor selection deferred. An adapter interface describes capabilities/outcomes without inventing payment/order enums. Never expose a general mark-success endpoint, accept browser paid flags or enable test event injection in production.

## Security and operational effects

Approve signing context, keys/custody, raw-body handling, replay/freshness, rate/abuse controls and production denial tests. A public portfolio sandbox may need mock checkout while forbidding injection routes; classify separately rather than disabling all backend sandbox outcomes. No hosted sandbox experiment now.

## API and database effects

Provider-neutral intent/attempt/result mapping, reconciliation identifiers, eligible capture/refund ceilings and error/unknown outcomes must match ADR-008/007. PAY-LIVE later reviews merchant eligibility, settlement, fees/disputes, callbacks/refunds and reconciliation against primary provider documentation before selection.

## Evidence, approval and reversal

PAY-01/OPS decide mock/test/prod exposure before MOCK. PAY-LIVE remains OPEN/deferred P1: PROVIDER_REVIEW decision, mock refund invariant proof, vendor certification and explicit live activation are distinct steps; do not require activated live funds to prepare eligibility policy. Later contracts and signed fixture tests precede effects. Reopen on environment/provider/capability changes.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).
