# Servo — Architecture

## One sentence

One XRPL transaction turns a wallet into a standing order: FDC proves
incoming XRP payments on-chain, FAssets v1.3 mints them into FXRP, an
off-chain strategy agent routes FXRP to the venue with the best realized
yield (priced by FTSO v2), and every execution leaves a verifiable
on-chain receipt.

## Two layers

```
XRPL wallet (user)                    Flare C-chain (contracts)
┌────────────────────┐               ┌──────────────────────────────────┐
│ Payment + memo     │ ──FDC attest──▶ │ FlareDataConnector 0x1000…0001  │
│ (0xFF PackedUserOp)│               │         │ proof                    │
└────────────────────┘               │         ▼                        │
                                     │  StandingOrderRegistry (ours)     │
                                     │  └─ per user: StandingOrder       │
                                     │     (amount, cadence, strategy,   │
                                     │      target venue, status)        │
                                     │         │                         │
                                     │         ▼                         │
                                     │  ExecutionController (ours)       │
                                     │  1. FTSO v2 price read            │
                                     │  2. FDC ReferencePayment verify   │
                                     │  3. FAssets v1.3 direct mint      │
                                     │  4. route FXRP to venue           │
                                     │  5. emit verifiable receipt       │
                                     └──────────────────────────────────┘

Off-chain (watcher + agent)          FAssets v1.3 (Flare foundation)
┌────────────────────┐               ┌──────────────────────────────────┐
│ FDC watcher        │               │ AssetManager 0x2a3F…6A8          │
│  polls verifier    │               │  executeDirectMinting / mint      │
│  submits proofs    │               │  fAsset: FXRP 0xAd55…1c5bE       │
├────────────────────┤               └──────────────────────────────────┘
│ RealizedYieldIndexer│              Yield venues (read-only):
│  7/30d realized APY│               Firelight (stXRP), Kinetic,
│  from share prices │               Clearstar/Upshift vaults
├────────────────────┤
│ StrategyAgent      │               FTSO v2 (prices every decision)
│  score venues      │
│  auto-execute ≥70% │
│  ask below 70%     │
└────────────────────┘
```

## Standing order lifecycle

1. **Setup** — user sends an XRPL Payment with a memo carrying the
   standing-order instruction. Memo opcode `0xFF` (memo-field custom
   instruction): the full ABI-encoded `PackedUserOperation` rides inline in
   the XRPL memo. This is Servo's "one signature".
2. **Attest** — the watcher requests an FDC `ReferencePayment` attestation
   for the XRPL transaction (~90 s round). The proof lands on
   `FlareDataConnector`.
3. **Register** — `StandingOrderRegistry.acceptProof` verifies the
   attestation, checks the instruction (cadence, amount, strategy), and
   stores/updates the user's standing order.
4. **Execute (per cadence)** — the agent (off-chain clock) checks each
   active order; when due, it calls `ExecutionController.execute`:
   - reads `FtsoV2` XRP/USD (real price, on-chain),
   - verifies the FDC proof for the minted payment,
   - calls `AssetManager.executeDirectMinting` (FAssets v1.3) so incoming
     XRP becomes FXRP,
   - routes FXRP to the target venue (Firelight stXRP / Kinetic / Clearstar),
   - emits `ExecutionReceipt(amount, price, route, txId)`.
5. **Receipt** — every execution is a verifiable on-chain event; the UI (when
   rebuilt) reads only real events.

## Security posture

- **Propose-only agent**: the strategy agent can propose routes; execution
  requires the on-chain controller's checks (price freshness, proof validity,
  per-tick caps, circuit breaker).
- **Human-in-the-loop**: below the agent's confidence threshold (70%), a
  single user signature is requested — matching FSA's one-signature model.
- **Reentrancy guards** on all mutating functions; registry stores no funds.
- No hardcoded addresses: registry lookup + env vars.

## Known risks / open questions

- FSA `MasterAccountController` is a diamond; PersonalAccount per user is a
  proxy — exact `handleMintedFAssets` callback + executor fee mechanics need
  verification against the deployed ABI (Phase 1 day-1 task).
- FAssets v1.3 mint caps / executor rules may throttle demo minting — orders
  must also work against an existing FXRP balance (minting is a bonus leg).
- Flare has no native cron — the keeper is an off-chain relayer (documented,
  accepted pattern for this class of product).
