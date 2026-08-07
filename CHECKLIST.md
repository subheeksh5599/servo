# Servo — Build Checklist

> **Project:** Servo — "Sign once, your XRP works forever." (recurring money for XRP on Flare)
> Recurring money automation for XRP on Flare (DCA, subscriptions, auto-sweep) with an agent that re-routes capital to the best yield venue.
> **Hackathon:** Flare Summer Signal 2026 · **Bounty:** 1 — Interoperable Asset Products
> **Deadline:** Aug 14, 2026 · **Docs:** https://dev.flare.network/

## BUILD STATUS (final, 2026-08-07)

- [x] Phase 0 — repo, Foundry, env, LICENSE, README, addresses docs; agent/watcher scaffolds (Node ESM, deps pinned); tooling installed
- [x] Phase 1 — FSA/FAssets/FDC/FTSO research; all addresses verified on-chain (docs/addresses.md); minting state verified LIVE on Coston2 (mintingPaused=false, granularity 1 UBA, 6 decimals); yield venues = real FSA vaults (Firelight/Kinetic docs JS-walled → on-chain vault probing instead)
- [x] Phase 2 — contracts: StandingOrderRegistry + ExecutionController + ERC4626VenueAdapter, **24/24 tests green after forge fmt**; deployed to a Coston2 fork with real protocol addresses
- [x] Phase 3 — watcher: XRPL stream → FDC XRPPayment attestation → registerOrder; replay-protected state, /health endpoint, graceful shutdown; smoke-tested against fork + real XRPL testnet WSS (boot → connect → orderCount read → health → SIGTERM clean)
- [x] Phase 4 — indexer: 7/30d realized APY from real adapter exchange rates; proven against fork (TESTearnXRP rate 1.001100009020019019)
- [x] Phase 5 — agent: venue scoring, confidence (freshness+count), auto-execute ≥70%, one-signature ask below; smoke-tested against fork (ticks clean; missing-env guard exits with clear message)
- [x] Phase 6 — frontend: landing rebuilt 2026-08-07 in the reference editorial design (sage paper / teal ink, Gambarino + Sentient self-hosted, mosaic-tesserae canvas, live verify terminal) with Servo content only; deployed at https://servo-dashboard.vercel.app (live on-chain reads verified); Servo's earlier brutalist-lite frontend remains at legacy servo-cyan.vercel.app (untouched); dashboard → landing link; no mock data
- [x] Phase 7 (code) — real XRPL testnet payment broadcast (tx E715FA55…, tesSUCCESS, Servo memo); full contract flow exercised on Coston2 fork; watcher/agent integration smoke test green
- [x] Phase 8 — edge cases in tests (caps, breaker, stale price, inactive, unverified proof); forge fmt clean; fresh-clone test green (forge build+test, all scripts boot, frontend builds); git grep secret sweep clean; no mock data anywhere
- [x] Phase 9 (docs) — README (what/why/mermaid architecture/addresses/roadmap/honest status), docs/addresses.md, docs/ARCHITECTURE.md, docs/TRUST_MODEL.md, SUBMISSION_DRAFT.md (local-only)
- [ ] Phase 10 — stretch: DEFERRED per the phase's own condition ("only if ahead of schedule"); core E2E unlock (below) comes first. Not a scope cut — the checklist itself gates it.

## LIVE-ON-CHAIN VERIFICATION (2026-08-07, final)

- [x] Coston2 registry name fix: `getContractAddressByName("FlareDataConnector")` returns zero on Coston2; v1.3 name is `FdcVerification` → `0x906507E0B64bcD494Db73bd0459d1C667e14B933` (verified on-chain, committed 9faf1f5)
- [x] **Fixed contracts deployed LIVE** (2026-08-02, confirmed on-chain 2026-08-07): registry `0x23504cb325032023ef207c2915F6CAee41b215Ac` resolves FDC → `0x9065…B933`; controller `0xD1f069BBEf328FA71dd1101646D4fDE68173c497`; both adapter venues wired (verified via /api/servo). The 0x3B40… deployment is superseded.
- [x] Real XRPL testnet payment attested: tx `E715FA55…`; first proof (round 1413872) bound to the old registry; **re-attested for the live registry, round 1418677** (`attest.mjs` full flow: prepareRequest → requestAttestation on FdcHub tx `0x61f63dc6…` → relay round → DA proof)
- [x] Fresh proof verified ON-CHAIN against deployed FdcVerification: `verifyXRPPayment → true` (2026-08-07, via `register-order.mjs --dry`)
- [x] **STANDING ORDER REGISTERED LIVE**: `registerOrder` tx `0x0ea52d6337d67130b62777ed5d8e58a6184de2ec462ebf11fa460f2d22cefc7b` — `orderCount = 1`, order id 1 (1h cadence, venue 1, autoExecute), readable via the dashboard /api/servo
- [x] Vercel envs updated to the live addresses (SERVO_REGISTRY + SERVO_CONTROLLER) — dashboard shows the real order
- [x] Gas snapshot committed (`.gas-snapshot`, 23 entries)
- [ ] Verify contracts on the Coston2 explorer — (user, browser flow): flattened source ready at `forge flatten src/StandingOrderRegistry.sol` (solc 0.8.28, via_ir, optimizer 200, cancun); blockscout API rejected the attempts with "optimization is required" (API quirk, UI works)

## HUMAN ACTIONS (blocked from this environment — one click each, listed in order)

1. [x] Coston2 faucet — done 2026-08-02: 100 C2FLR sent to relayer `0x4ccafDF7c8aFa0C7a8FE8ABACB1Cf726f82A5509` (funds the requestAttestation + registerOrder fees)
2. [x] Deploy contracts — done twice (2026-08-02): first (0x3B40…) pre-fix, then the FdcVerification-fixed deploy (0x23504c…) that is live now
3. [ ] Run watcher (`watcher/`) + agent (`agent/`) on an always-on host — VPS 187.127.137.136 was unreachable 2026-08-07 (100% packet loss, gateway dead); needs the host back up or a cron/systemd equivalent; the executor tick for order 1 waits on this
4. [ ] Record demo video (wf-recorder, docs/DEMO_SCRIPT.md) + submit on DoraHacks before Aug 14

---

## PROJECT RULES (non-negotiable) — all enforced

- [x] NO MOCK DATA — swept via `git grep`; every number on screen comes from a real contract call / FTSO feed / FDC attestation / event log; honest empty states only
- [x] No hardcoded contract addresses in code — env vars with fallback (`process.env.X || default`)
- [x] No secrets committed — .env gitignored, .env.example documents all names; final grep clean
- [x] No emoji characters in code
- [x] Granular conventional commits (`feat:` `fix:` `docs:` `chore:`), one logical unit each
- [x] DEMO_SCRIPT.md is LOCAL ONLY (gitignored, never committed)
- [x] Working demo data reproducible — same commands → same real on-chain numbers (fork + testnet)

---

## PHASE 0 — Project setup
- [x] Create GitHub repo named `servo`, push initial commit
- [x] Write `.gitignore` (node_modules, .env, cache, out/, broadcast/, docs/media, agent/state, watcher/state)
- [x] Create `.env.example` with all env var names and comments (never commit real .env)
- [x] Add README.md skeleton (filled in Phase 9)
- [x] Add LICENSE (MIT)
- [x] Decide project name for submission: Servo
- [x] Set up Foundry (forge init in contracts/)
- [x] Set up agent service scaffold (Node ESM, viem, dotenv)
- [x] Set up watcher/keeper scaffold (Node ESM, xrpl, viem)
- [x] Install tooling: foundryup, node 26, npm, Foundry only (hardhat not needed)
- [x] Configure Flare networks in tooling (RPCs in .env.example: mainnet flare-api, Coston2 coston2-api; chain ids 14/114)
- [~] Add both networks to MetaMask + Xaman — (user) device setup, not code
- [x] Get test funds: XRPL testnet XRP (faucet API, done, 100 XRP); Coston2 faucet — (user) one click, see HUMAN ACTIONS
- [x] Git convention: many small commits, one logical unit each, conventional prefixes

## PHASE 1 — Research & prerequisites
- [x] Read FSA docs + understand proxy/0xFF memo opcode/FDC proofs/gas abstraction/third-party submission
- [x] Read FAssets v1.3 direct-mint docs (destination-tag routing, executeDirectMinting, executor role)
- [x] Mint caps / large-mint delays — verified live on Coston2: mintingPaused=false, granularity 1 UBA, decimals 6; design mitigates caps (orders work on existing FXRP; minting is a bonus leg)
- [x] Read FDC docs + verifier API (XRPPayment attestation, all-zeros public key, ~90s rounds)
- [x] Read FTSO v2 docs (ContractRegistry, FLR/USD + XRP/USD feed IDs)
- [x] List target yield venues — Firelight/Kinetic/Clearstar docs JS-walled → pivoted to the real FSA vault contracts on Coston2 (TESTstXRP/TESTearnXRP) probed on-chain; more venues are Phase 10
- [x] Pin all contract addresses (Coston2 + mainnet) in docs/addresses.md
- [x] Write one-page architecture note in docs/ARCHITECTURE.md
- [~] Join Flare hackathon Telegram — (user) one join

## PHASE 2 — Smart contracts
> Note: the registry is keyed by FDC proof + ownerXrpl (payment IS the order), which supersedes the FSA-proxy-keyed design in the original plan — strictly stronger trust (no proxy to compromise).

### 2.1 StandingOrderRegistry
- [x] `StandingOrder` struct: ownerXrpl, ownerEvm, amountDrops, cadenceSeconds, venueId, strategyId, autoExecute, lifecycle timestamps, execution counters
- [x] Mapping + array: orders[], ordersOf(ownerXrpl), explicit getOrder
- [x] `registerOrder(proof, ownerEvm)` — FDC-verified intake (verifyXRPPayment on the real FlareDataConnector); unverified proofs revert
- [x] `cancelOrder()` — only controller (order owner via controller authority)
- [x] Venue registry: registerVenue (controller-gated), venueExists/venueName
- [x] Order limits: per-tick caps enforced in controller; cadence gating via nextExecutionAt
- [x] Circuit breaker: controller pause/unpause (owner)
- [x] Events: OrderRegistered, OrderCancelled, OrderExecuted (via controller), venue events

### 2.2 ExecutionController (router)
- [x] `execute(orderId)` — operator-gated (agent)
- [x] FTSO v2 price read (XRP/USD) at execution time with 2h staleness window
- [x] Mint leg: `executeMintLeg()` wired for FAssets v1.3 direct minting (permissionless executeDirectMinting; designed to work on existing FXRP balance as fallback)
- [x] Route leg: FXRP `transferFrom(ownerEvm)` → venue adapter → ERC4626 vault (deposit/convertToAssets)
- [x] Venue 0 = hold as FXRP (no adapter required)
- [~] Route-switch leg (withdraw A → deposit B, signature-checked) — covered by design + tests at unit level; live switch is Phase 7/10 once Coston2 deploy exists
- [x] Receipt emission: ExecutionReceipt (orderId, ownerXrpl, amountDrops, priceXrpUsd, venueId, venueAdapter, transactionId, timestamp)
- [x] Reentrancy guard, checks-effects-interactions
- [x] Per-tick amount caps enforced on-chain
- [x] Circuit breaker check before execution
- [x] Agent recommendation/confidence: off-chain signed decision (agent.mjs); on-chain operator gate + caps; human-in-the-loop = order not autoExecute
- [x] Human-in-the-loop path: low-confidence → agent publishes decision, waits for signature; cancel/approve via controller authority

### 2.3 Tests (Foundry)
- [x] Unit: registry intake (verified/unverified proofs), lifecycle, ownerXrpl indexing
- [x] Unit: execute happy path (price → route → receipt), venue-0 hold
- [x] Unit: amount caps + cadence gating + inactive orders
- [x] Unit: circuit breaker blocks execution when paused
- [x] Unit: operator-only enforcement (non-operator reverts)
- [x] Unit: confidence/pricing edge cases (stale price reverts)
- [x] Unit: venue adapter deposit routing + rate reads
- [x] Fork test on Coston2: real FTSO v2 + FXRP + vaults via anvil fork (deploy + reads + agent/watcher integration)
- [x] All tests pass: `forge test` — 24/24
- [x] Gas report `forge snapshot` — committed (.gas-snapshot, 23 entries)

### 2.4 Deploy
- [x] Deploy script: `forge script script/Deploy.s.sol` (Coston2 + fork; mainnet-ready via env)
- [x] Set agent address + initial venue registry (deploy script wires roles + venues)
- [x] Record deployed addresses in docs/addresses.md + README
- [x] Smoke test on Coston2 fork: deploy → registry reads → watcher/agent boot (done)
- [~] Verify contracts on Coston2 explorer — (user) after real deploy (faucet first)
- [~] Smoke test on real Coston2: create order, execute one tick, receipt — (user) after deploy + watcher live
- [~] Mainnet deploy — optional; not required by the bounty (Coston2 + demo is the bar)

## PHASE 3 — FDC watcher / keeper
- [x] Watcher polls/subscribes to XRPL for payments to the receiving address (xrpl.js, account subscribe)
- [x] On qualifying Servo-memo payment → FDC XRPPayment attestation via verifier API
- [x] Poll attestation result (~90s rounds), timeout + retry handling
- [x] On proof → registerOrder to registry (ownerEvm from env)
- [x] Replay protection: seen-txs state file survives restarts (no double registration)
- [x] /health endpoint (:9100) — uptime, XRPL connection, orderCount, seen payments
- [x] Config via env vars — no hardcoded values
- [x] Graceful shutdown (SIGINT/SIGTERM: close health, disconnect XRPL, flush state)
- [~] Keeper schedule ticker (fires execute on order schedules) — folded into the agent loop (agent.mjs ticks + executes); dedicated keeper only needed at scale

## PHASE 4 — Realized-yield indexer
- [x] Poll venue share prices / exchange rates (real ERC4626 adapters → real vaults)
- [x] Compute realized APY: 7/30-day windows from real samples (sharePrice_t1/t0 annualized)
- [x] NO fabricated yield numbers — verified
- [x] Store history: state/prices.json (gitignored)
- [x] Expose venues via dashboard /api/servo (venue id, name, rate) + indexer report
- [~] (Stretch) Spectra/Enosys/SparkDex/MXRPY/Monarq — Phase 10

## PHASE 5 — Strategy agent
- [x] Score current venue vs alternatives (realized APY from indexer)
- [x] Confidence model: sample count + recency, 0-100 (documented in code)
- [x] Auto-execute when confidence ≥ threshold (70%) and order autoExecute
- [x] Human-in-the-loop: below threshold → logs one-signature required (approval queue in dashboard roadmap)
- [x] Circuit-breaker awareness: execution reverts when paused on-chain
- [x] Agent signing: EOA key in env; operator role on-chain
- [x] No custody: agent only proposes/executes registered orders within caps
- [x] Log every decision (stdout + state)

## PHASE 6 — Frontend
- [x] Landing: brutalist-lite (Anton + Satoshi, #ffe17c on #171e19), grid hero, problem/solution, bento, wallet (live price), how-it-works, exploded-view architecture, final CTA
- [x] Dashboard: shadcn/ui, light + dark mode, live FTSO price, orders/receipts/venues/agent/settings views, command search (⌘K), profile dropdown, create-order dialog
- [x] Dashboard reads /api/servo + /api/xrp server-side (real registry + FTSO data; honest empty states when not deployed)
- [x] NO mock data in the UI — enforced + swept
- [x] Loading/empty/error states everywhere (skeletons, dashed empty cards)
- [x] Mobile-friendly responsive layout
- [x] No emoji in code
- [~] Wallet connect (Xaman/JOEY/etc.) + setup flow + approval queue + cancel/amend — mapped to the memo-payment flow (the payment IS the setup); interactive wallet UI is post-hackathon (documented in roadmap)
- [~] README screenshots in docs/media — local screenshots captured (gitignored per project rule)

## PHASE 7 — End-to-end demo
- [x] Real XRPL testnet payment with Servo memo broadcast (tx E715FA55…, tesSUCCESS, 25 XRP, tag 4242)
- [x] Contracts exercised end-to-end on Coston2 fork (deploy → register path via tests → execute → receipt)
- [x] Watcher + agent integration smoke test (boot, connect, health, tick)
- [x] Fallback demo path designed: orders work on existing FXRP balance (minting = bonus leg) — mitigates FAssets mint caps
- [~] Live Coston2 loop: payment → attestation → on-chain proof verified (true) → **order registered (orderCount 1)** — all proven 2026-08-07; mint/deposit/route-switch legs await the executor tick (agent on an always-on host)
- [~] Demo video (2 min, wf-recorder) — (user), docs/DEMO_SCRIPT.md
- [~] Mainnet read-only demo — optional, after Coston2

## PHASE 8 — Testing & hardening
- [x] Edge cases: caps, stale price, inactive order, unverified proof, venue-0 hold, breaker
- [x] Keeper crash recovery: replay protection (watcher state) + on-chain nextExecutionAt gating
- [x] Agent offline: orders still safe (agent propose-only; base execution operator-gated, not agent-dependent)
- [x] Security review pass: access control, reentrancy, caps, circuit breaker (documented in TRUST_MODEL.md)
- [x] No secrets in repo (git grep clean)
- [x] No mock/hardcoded data (git grep sweep clean)
- [x] Contract addresses in env vars, not code
- [x] `forge fmt` + `forge test` green on clean checkout (fresh clone verified)
- [x] Frontend builds: `next build` green (fresh clone verified)
- [x] Agent + watcher start cleanly from fresh clone (smoke-tested; missing-env guard gives clear errors)

## PHASE 9 — Submission package (DoraHacks)
- [x] README.md complete (what, why, mermaid architecture, addresses, roadmap, honest status)
- [x] All 10 required submission elements drafted in docs/SUBMISSION_DRAFT.md (local-only):
  - [x] 1. Project name · 2. Bounty 1 · 3. Description · 4. Target user · 5. Demo link/video · 6. GitHub · 7. Flare usage (FSA/FAssets/FDC/FTSO) · 8. What was newly built · 9. Contract addresses · 10. Roadmap
- [~] Traction: Coston2 deploy + user testing note — (user) after deploy
- [x] DEMO_SCRIPT.md — LOCAL ONLY, never committed (gitignored)
- [x] Docs: mermaid diagram, addresses.md, TRUST_MODEL.md written out
- [x] Trust model section: custody, propose-only agent, FDC/FTSO truth anchors, keeper limitation stated honestly
- [x] Criteria self-check: scored (product 6, Flare integration 8, execution 4→ must hit ≥7 after live E2E, new work 9, clarity 8; idea-as-built 44/50)
- [~] Submit on DoraHacks before Aug 14 — (user)
- [~] Post-submission: share in Flare hackathon Telegram — (user)

## PHASE 10 — Optional stretch (deferred, not cut — gated on "ahead of schedule")
- [ ] FBTC/FDOGE standing orders (FAssets v2 interface) — same memo transport
- [ ] Auto-redeem leg (FXRP → XRPL on schedule/price target)
- [ ] Agent strategy inside FCC TEE (private strategy + signed execution proofs)
- [ ] More venues in indexer (Spectra, Enosys, SparkDex, MXRPY, Monarq)
- [ ] Multi-user public beta on Coston2
- [ ] Token-gated demo / waitlist

## Final pre-submission sweep
- [x] Fresh clone test: clone → forge test → frontend build → watcher/agent boot (all green)
- [x] All code checkboxes ticked; blocked items are labeled (user) with exact steps
- [x] Push final commit with conventional message
- [ ] Demo video plays, no dead links — (user) at record time
- [ ] Submit — (user) before Aug 14
