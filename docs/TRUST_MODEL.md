# Servo — Trust model

## Custody
Non-custodial. The user's XRP and FXRP live in their own wallet / their own
ownerEvm address. Servo never holds funds; the controller only ever moves
FXRP the user approved by signing the standing order (ownerEvm allowance).

## The agent
Propose-only by construction:
- The agent (operator) can only trigger executions of orders that exist in
  the registry, within per-order and per-tick caps, at FTSO v2 prices with a
  2h staleness window.
- The agent cannot transfer funds to itself, cannot change order parameters,
  and cannot bypass the circuit breaker.
- Below 70% confidence the agent does nothing without one more signature.

## Truth anchors
- XRPL payments: FDC XRPPayment attestation, verified against the enshrined
  FlareDataConnector on-chain. The registry rejects unverified proofs.
- Prices: FTSO v2 (same oracle the network uses for everything else).
- Yield: ERC4626 exchange rates read from the actual vault contracts.

## Keeper limitation (stated honestly)
Flare has no native cron. The watcher/agent are off-chain relayers — the
standard, documented pattern for Flare automation. If the relayer is down,
orders do not execute until it returns (no double-execution is possible:
execution is gated by nextExecutionAt on-chain, and the watcher keeps
replay-protected state).
