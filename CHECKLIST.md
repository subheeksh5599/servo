# Servo — Build Checklist

> **Project:** Servo — "Sign once, your XRP works forever." (recurring money for XRP on Flare)
> Recurring money automation for XRP on Flare (DCA, subscriptions, auto-sweep) with an agent that re-routes capital to the best yield venue.
> **Hackathon:** Flare Summer Signal 2026 · **Bounty:** 1 — Interoperable Asset Products
> **Deadline:** Aug 14, 2026 · **Docs:** https://dev.flare.network/

## BUILD STATUS (actual, 2026-08-02, updated)

- [x] Phase 0 — repo, Foundry, env, LICENSE, README, addresses docs; agent/watcher scaffolds (Node ESM, deps pinned); tooling installed
- [x] Phase 1 — FSA/FAssets/FDC/FTSO research; all addresses verified on-chain (docs/addresses.md); minting state verified LIVE on Coston2 (mintingPaused=false, granularity 1 UBA, 6 decimals); yield venues = real FSA vaults (Firelight/Kinetic docs JS-walled → on-chain vault probing instead)
- [x] Phase 2 — contracts: StandingOrderRegistry + ExecutionController + ERC4626VenueAdapter, **24/24 tests green after forge fmt**; deployed to a Coston2 fork with real protocol addresses
- [x] Phase 3 — watcher: XRPL stream → FDC XRPPayment attestation → registerOrder; replay-protected state (state/seen-txs.json), /health endpoint, SIGINT/SIGTERM graceful shutdown; attestation type fixed to XRPPayment (was ReferencePayment — would have failed live)
- [x] Phase 4 — indexer: 7/30d realized APY from real adapter exchange rates; proven against fork (TESTearnXRP rate 1.001100009020019019)
- [x] Phase 5 — agent: venue scoring, confidence (freshness+count), auto-execute ≥70%, one-signature ask below; ticked against fork
- [x] Phase 6 — frontend rebuilt (post-removal): brutalist-lite landing + shadcn/ui dashboard with light/dark mode, live FTSO price, honest empty states; deployed at servo-cyan.vercel.app
- [~] Phase 7 — E2E: real XRPL testnet payment broadcast (tx E715FA55…, tesSUCCESS, Servo memo); contracts exercised on Coston2 fork; BLOCKED ITEMS (user-side, one click each): Coston2 faucet reCAPTCHA (https://faucet.flare.network/coston2) + FDC verifier WAF from this machine — live attestation→mint leg runs the moment those unlock
- [x] Phase 8 — edge cases in tests (caps, breaker, stale price, inactive, unverified proof); forge fmt clean; fresh-clone test green (forge build+test, all scripts syntax-check, frontend build); git grep secret sweep clean; no mock data anywhere
- [~] Phase 9 — submission package: README + TRUST_MODEL.md + SUBMISSION_DRAFT.md (local-only, 10 elements with [placeholders]); remaining (user): DoraHacks form + demo video + Coston2 addresses after deploy
- [ ] Phase 10 — stretch (FBTC/FDOGE, auto-redeem, FCC TEE, more venues): deferred per checklist's own condition ("only if ahead of schedule") — core E2E still needs the faucet/verifier unlock first

## REMAINING — HUMAN ACTIONS (blocked from this environment, not scope cuts)
1. Coston2 faucet, one click (reCAPTCHA): https://faucet.flare.network/coston2 → address 0x4ccafDF7c8aFa0C7a8FE8ABACB1Cf726f82A5509 (relayer, key in .env) — 100 C2FLR + 10 FXRP per 24h
2. Deploy: forge script script/Deploy.s.sol --rpc-url https://coston2-api.flare.network/ext/C/rpc --private-key <relayer> --broadcast → paste addresses into Vercel envs SERVO_REGISTRY + SERVO_CONTROLLER → dashboard goes live
3. Run watcher (watcher/) + agent (agent/) on an always-on host (VPS 187.127.137.136 or cron); if verifier WAF persists, run from that host — different egress
4. Record demo video (wf-recorder, docs/DEMO_SCRIPT.md) + submit on DoraHacks before Aug 14

## PROJECT RULES (non-negotiable)

- [ ] NO MOCK DATA — nowhere. No fake balances, no sample positions, no fabricated charts, no hardcoded demo numbers in the frontend, agent, or watcher. Every number on screen comes from a real contract call, real FTSO feed, real FDC attestation, or real event log. If there is no real data yet, show a real empty state — never a fake one.
- [ ] No hardcoded contract addresses in code — env vars with fallback (`process.env.X || default`).
- [ ] No secrets committed — .env never in git, keys only in env.
- [ ] No emoji characters in code (unicode typography like arrows/dashes is fine).
- [ ] Granular conventional commits (`feat:` `fix:` `docs:` `chore:`), one logical unit each.
- [ ] DEMO_SCRIPT.md is LOCAL ONLY, never committed.
- [ ] Working demo data must be reproducible: anyone running the demo instructions gets the same real on-chain numbers.

---

## PHASE 0 — Project setup

- [x] Create GitHub repo named `servo`, push initial commit
- [x] Write `.gitignore` (node_modules, .env, cache, out/, broadcast/, docs/media)
- [x] Create `.env.example` with all env var names and comments (never commit real .env)
- [x] Add README.md skeleton (fill fully in Phase 9)
- [x] Add LICENSE (MIT or Apache-2.0)
- [x] Decide project name for submission: Servo
- [x] Set up Foundry (forge init in contracts/)
- [x] Set up frontend scaffold — N/A (frontend removed; backend focus)
- [ ] Set up agent service scaffold (Node/TypeScript or Python)
- [ ] Set up watcher/keeper scaffold
- [ ] Install tooling: foundryup, node 22+, pnpm/npm, hardhat not needed (Foundry only)
- [ ] Configure Flare network in wallets + tooling:
  - [ ] Flare mainnet RPC: `https://flare-api.flare.network/ext/C/rpc` (chain 14)
  - [ ] Coston2 testnet RPC (from dev.flare.network network config)
  - [ ] Add both networks to MetaMask + Xaman (testnet)
- [ ] Get test funds:
  - [ ] Coston2 faucet (test FLR + test tokens)
  - [ ] XRPL testnet XRP (XRPL faucet)
  - [ ] (Optional) small mainnet FLR for gas + read-only checks
- [ ] Git convention: many small commits, one logical unit each, prefixes `feat:` `fix:` `docs:` `chore:` (commit as you go, never one giant commit)

---

## PHASE 1 — Research & prerequisites (Day 1)

- [x] Read Flare Smart Accounts (FSA) docs: https://fsa.flare.network + dev docs
- [x] Read FSA smart account proxy contracts on the explorer — understand:
  - [x] How the proxy is mapped 1:1 to an XRPL address
  - [x] How memo-encoded instructions are parsed and executed (0xFF memo opcode carries full PackedUserOperation)
  - [x] How FDC proves the XRPL transaction on-chain (Payment + ReferencePayment attestations)
  - [x] Gas abstraction mechanism (FSA pays gas; executor fees)
  - [x] How a third party (our keeper/agent) can submit instructions for a user's FSA
- [x] Read FAssets v1.3 direct-mint docs:
  - [x] Destination-tag / memo routing mechanism (Core Vault + executeDirectMinting)
  - [x] Executor role + restrictions (direct minting executor)
  - [ ] Mint caps (hourly/daily) and large-mint delays — verify against deployed contract
  - [ ] Minimum mint amounts and fees — verify against deployed contract
- [x] Read FDC docs + verifier API:
  - [x] ReferencePayment attestation type (used for XRPL payments)
  - [x] Public verifier API endpoint + key (all-zeros public key)
  - [x] Attestation round timing (~90s)
- [x] Read FTSO v2 docs:
  - [x] ContractRegistry address
  - [x] FtsoV2 feed IDs: FLR/USD `0x01464c522f555344...`, XRP/USD `0x015852502f555344...`
- [ ] List target yield venues + their contracts:
  - [ ] Firelight (stXRP LST) — exchange rate contract
  - [ ] Kinetic (lending) — supply index contract
  - [ ] Clearstar / Upshift vault — share price contract
  - [ ] (Stretch) Spectra, Enosys, SparkDex, MXRPY, Monarq
- [x] Pin all contract addresses (Coston2 + mainnet) in a single `addresses.md` in docs/
- [x] Write a one-page architecture note in docs/ARCHITECTURE.md (update as you build)
- [ ] Join Flare hackathon Telegram group (https://t.me/+5Vn6ZKhr6KI3NjIx) + ask questions if stuck

---

## PHASE 2 — Smart contracts (Solidity / Foundry)

### 2.1 StandingOrderRegistry
- [ ] `StandingOrder` struct: xrplAddress, schedule, amount, venue target, risk tolerance, agentThreshold, status flags
- [ ] Mapping: FSA proxy address → StandingOrder
- [ ] `createOrder()` — only callable by the user's FSA proxy (msg.sender check)
- [ ] `amendOrder()` / `cancelOrder()` — same access control
- [ ] Agent role: `setAgent()`, `isAgent` — propose-only permissions
- [ ] Order limits: min/max amount, max frequency, per-tick caps
- [ ] Circuit breaker: `pause()` / `unpause()` (owner or governance)
- [ ] Events: OrderCreated, OrderAmended, OrderCancelled, OrderPaused

### 2.2 ExecutionController (router)
- [ ] `executeTick(orderId, attestationRef, agentDecisionRef)` — keeper entry point
- [ ] FTSO v2 price read (XRP/USD) at execution time
- [ ] Mint leg: consume FDC ReferencePayment attestation → call FAssets v1.3 direct-mint (destination tag routing)
- [ ] Route leg: deposit FXRP into target venue:
  - [ ] Lending supply (Kinetic/Avant interface)
  - [ ] Vault deposit (Clearstar/Upshift interface)
  - [ ] DCA ladder hold (internal balance)
- [ ] Route-switch leg: withdraw from venue A → deposit into venue B (agent-triggered, signature-checked)
- [ ] Receipt emission: timestamp, amount, price, route, agentDecisionRef
- [ ] Reentrancy guard, checks-effects-interactions
- [ ] Per-tick amount caps enforced on-chain
- [ ] Circuit breaker check before any execution
- [ ] Agent recommendation verification (signed decision, confidence >= threshold, venue exists)
- [ ] Human-in-the-loop path: low-confidence switch requires user FSA signature (approval)

### 2.3 Tests (Foundry)
- [ ] Unit tests: registry access control (only FSA proxy can create/amend/cancel)
- [ ] Unit tests: executeTick happy path (mint + route + receipt)
- [ ] Unit tests: amount caps + frequency limits
- [ ] Unit tests: circuit breaker blocks execution when paused
- [ ] Unit tests: agent cannot transfer funds / propose-only enforced
- [ ] Unit tests: confidence threshold enforcement (auto vs approval path)
- [ ] Unit tests: reentrancy attempt
- [ ] Fork test on Coston2: real FTSO v2 + FAssets + venue contracts (if addresses available)
- [ ] All tests pass: `forge test`
- [ ] Gas report: `forge snapshot` — check costs are sane

### 2.4 Deploy
- [ ] Deploy script: `forge script` for Coston2
- [ ] Deploy script: `forge script` for mainnet
- [ ] Verify contracts on Coston2 explorer (flattened source)
- [ ] Verify contracts on mainnet explorer (if deployed)
- [ ] Set agent address + initial venue registry
- [ ] Record deployed addresses in docs/addresses.md
- [ ] Smoke test on Coston2: create order, execute one tick, check receipt event

---

## PHASE 3 — FDC watcher / keeper (off-chain)

- [ ] Watcher polls XRPL for payments to user addresses with standing orders (xrpl.js / rippled public node)
- [ ] On qualifying payment → submit FDC ReferencePayment attestation request via verifier API
- [ ] Poll attestation result (~90s rounds), handle timeout + retry
- [ ] On attestation proof → submit executeTick to ExecutionController with proof
- [ ] Keeper: schedule-based ticker (cron / setInterval) that fires executeTick on order schedules
- [ ] Keeper handles: gas (fund keeper EOA on Coston2 + mainnet), nonce management, retries
- [ ] Error handling: failed txs logged, alerts, no silent drops
- [ ] Monitoring: simple log/health endpoint (`/health`) 
- [ ] Config via env vars (RPC, keys, contract addresses) — no hardcoded values
- [ ] Graceful shutdown + restart safety (no double-execution of same tick — idempotency via nonce/order state)

---

## PHASE 4 — Realized-yield indexer

- [ ] Poll venue share prices / supply indexes:
  - [ ] Firelight stXRP exchange rate
  - [ ] Kinetic supply index
  - [ ] Clearstar vault share price
- [ ] Compute realized APY: 7-day and 30-day windows (sharePrice_t1/sharePrice_t0 annualized)
- [ ] NO fabricated yield numbers — every APY figure derived from real on-chain share prices / supply indexes, never seeded or interpolated
- [ ] Store history (Postgres or simple JSON/SQLite — keep simple)
- [ ] (Stretch) Spectra, Enosys, SparkDex, MXRPY, Monarq venues
- [ ] Expose simple API: `/venues` (id, name, realized7d, realized30d, volatility, lastUpdated)

---

## PHASE 5 — Strategy agent

- [ ] Score current venue vs alternatives: realized APY, volatility, venue health, withdrawal delay
- [ ] Produce signed recommendation: {orderId, from, to, expectedDelta, confidence}
- [ ] Auto-execute when confidence >= threshold (submit to ExecutionController)
- [ ] Human-in-the-loop: confidence < threshold → publish to dashboard approval queue
- [ ] Confidence model: simple weighted score (document the formula in README)
- [ ] Circuit-breaker awareness: agent pauses recommendations if venue health flags
- [ ] Agent signing: EOA key in env, propose-only role on-chain
- [ ] No custody: agent never holds user funds, only proposes
- [ ] Log every decision (for demo + transparency)

---

## PHASE 6 — Frontend

- [ ] Wallet connect: Xaman, JOEY, Ledger, D'CENT, WalletConnect (the 5 FSA wallets)
- [ ] Setup flow: pick schedule + amount + venue → sign ONE XRPL transaction (memo-encoded order)
- [ ] Standing order confirmation screen
- [ ] Dashboard: position growth chart (FXRP balance + venue balance over time)
- [ ] Dashboard: execution receipts list (from contract events)
- [ ] Dashboard: agent decisions feed (recommendations + confidence)
- [ ] Approval queue: pending low-confidence switches → approve with one signature
- [ ] Cancel / amend standing order (one signature)
- [ ] NO mock data in the UI — every balance, chart point, APY, and receipt renders from real contract calls / FTSO feeds / event logs; no sample positions, no hardcoded demo numbers. No real data yet → show a genuine empty state.
- [ ] Loading/empty/error states everywhere
- [ ] Mobile-friendly (most XRP users are on mobile wallets)
- [ ] Design: clean dark UI, Flare brand colors, readable numbers
- [ ] No emoji in code (project rule) — unicode typography fine
- [ ] README screenshot in docs/media/ (viewport-height screenshots)

---

## PHASE 7 — End-to-end demo

- [ ] E2E demo on Coston2: 
  - [ ] Create standing order with testnet XRPL wallet (one signature)
  - [ ] Send a test XRP payment from XRPL testnet
  - [ ] Watch FDC attestation + FXRP mint (or pre-minted FXRP fallback)
  - [ ] Watch auto-deposit into venue
  - [ ] Trigger agent route-switch (auto-execute + approval paths)
  - [ ] Show receipts on explorer
- [ ] Demo runs on REAL Coston2 + XRPL testnet data end to end — no fabricated balances, charts, or events in the video or UI
- [ ] Mainnet read-only demo (positions + realized APY + agent feed) if Coston2 demo is complete
- [ ] Record demo video (2 min max) — user records own demos (wf-recorder), follow their flow
- [ ] Fallback demo path ready: scheduler-triggered one-signature flow (if FSA internals block the full path)

---

## PHASE 8 — Testing & hardening

- [ ] Edge cases: zero balance tick, duplicate tick, expired attestation, large amount caps
- [ ] Keeper crash recovery: no double-execution
- [ ] Agent offline: orders still execute on schedule (agent is propose-only, not required for base flow)
- [ ] Security review pass: access control, reentrancy, caps, circuit breaker
- [ ] Check no secrets in repo (`git grep` for keys, .env in .gitignore)
- [ ] Sweep for mock/hardcoded data: `git grep` for fake addresses, sample balances, seeded numbers, TODO-fake-data comments — all must be gone
- [ ] Contract addresses in env vars, NOT hardcoded in code (project rule)
- [ ] `forge fmt` + `forge test` green on clean checkout
- [ ] Frontend builds: `next build` green
- [ ] Agent + watcher start cleanly from fresh clone with .env.example

---

## PHASE 9 — Submission package (DoraHacks)

- [ ] README.md complete (Nendo format: what, why, architecture mermaid diagram, screenshots, addresses, roadmap)
- [ ] All 10 required submission elements:
  - [ ] 1. Project name
  - [ ] 2. Selected bounty (Bounty 1 — Interoperable Asset Products)
  - [ ] 3. Short product description
  - [ ] 4. Target user
  - [ ] 5. Demo link / video / working app link
  - [ ] 6. GitHub repo link
  - [ ] 7. Explanation of how the project uses Flare (FSA + FAssets v1.3 + FDC + FTSO v2)
  - [ ] 8. Explanation of what was newly built during the hackathon
  - [ ] 9. Smart contract addresses (Coston2 + mainnet)
  - [ ] 10. Short roadmap / next steps (FBTC version, redemption leg, FCC/TEE private strategy)
- [ ] Traction checklist (encouraged, not required):
  - [ ] Deployed on Coston2 (and mainnet if possible)
  - [ ] Note any user testing / feedback
- [ ] DEMO_SCRIPT.md — LOCAL ONLY, never committed to the repo
- [ ] Docs: architecture diagram (mermaid), addresses.md, trust model written out
- [ ] Trust model section: custody (non-custodial), agent propose-only, FDC/FTSO truth anchors, keeper off-chain limitation stated honestly
- [ ] Final criteria self-check before submitting (score each 1-10, fix anything <7):
  - [ ] Product usefulness
  - [ ] Flare integration quality
  - [ ] Technical execution (demo works)
  - [ ] Evidence of new work
  - [ ] Clarity and future potential
- [ ] Submit on DoraHacks before Aug 14 deadline
- [ ] Post-submission: share in Flare hackathon Telegram group

---

## PHASE 10 — Optional stretch (only if ahead of schedule)

- [ ] FBTC-ready standing orders (FAssets v2 interface)
- [ ] Auto-redeem leg (FXRP → XRPL on schedule/price target)
- [ ] Agent strategy logic inside FCC TEE (private strategy + signed execution proofs) — moves toward Bounty 2 territory
- [ ] More venues in indexer (Spectra, Enosys, SparkDex, MXRPY, Monarq)
- [ ] Multi-user public beta on Coston2
- [ ] Token-gated demo or waitlist landing page

---

## Final pre-submission sweep (last 2 hours)

- [ ] Fresh clone test: `git clone` → `.env.example` → contracts test → frontend build → watcher/agent start
- [ ] Demo video plays, no dead links
- [ ] All checkboxes above are ticked or marked N/A
- [ ] Push final commit with conventional message
- [ ] Submit
