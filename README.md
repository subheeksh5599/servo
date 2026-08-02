# Servo — Sign once. Your XRP works forever.

Recurring money for XRP, built on Flare. One XRPL signature sets up
dollar-cost averaging, subscriptions, and auto-sweep. A strategy agent
routes capital to the best yield venue — and only ever asks permission.

**Flare Summer Signal 2026 · Bounty 1 — Interoperable Asset Products**

## The idea in one sentence

One XRPL transaction turns your wallet into a standing order: FDC proves
incoming XRP payments on-chain, FAssets v1.3 mints them into FXRP, an
off-chain strategy agent routes the FXRP to the venue with the best
realized yield (priced by FTSO v2), and every execution leaves a
verifiable on-chain receipt.

## Repo layout

- `contracts/` — Foundry: StandingOrderRegistry + ExecutionController
- `watcher/` — FDC attestation watcher (proves XRPL payments)
- `agent/` — realized-yield indexer + strategy agent
- `docs/` — architecture note, pinned addresses

## Status

Under active development for the hackathon deadline (Aug 14, 2026).
See CHECKLIST.md for the full build plan.
