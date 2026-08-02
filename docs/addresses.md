# Servo — Pinned Contract Addresses

All addresses verified on-chain (via `cast call` against the FlareContractRegistry
or the contracts themselves) unless noted. Registry lookup is preferred in code
(`FlareContractRegistry.getContractAddressByName(string)` — selector `0x82760fca`).

## Core protocol addresses

| Contract | Mainnet (chain 14) | Coston2 (testnet) |
|---|---|---|
| FlareContractRegistry | `0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019` | same |
| FlareDataConnector (FDC) | `0x1000000000000000000000000000000000000001` | same |
| StateConnector | `0x1000000000000000000000000000000000000001` | same |
| FtsoV2 | `0x7bde3df0624114edb3a67dfe6753e62f4e7c1d20` | `0xc4e9c78ea53db782e28f28fdf80baf59336b304d` |
| FlareSystemsManager | `0x89e50dc0380e597ece79c8494baafd84537ad0d4` | `0xa90db6d10f856799b10ef2a77ebcbf460ac71e52` |
| FAssets AssetManager | `0x2a3Fe068cD92178554cabcf7c95ADf49B4B0B6A8` | `0xc1Ca88b937d0b528842F95d5731ffB586f4fbDFA` |
| FXRP (fAsset token) | `0xAd552A648C74D49E10027AB8a618A3ad4901c5bE` | `0x0b6A3645c240605887a5532109323A3E12273dc7` |
| MasterAccountController (FSA) | `0x434936d47503353f06750Db1A444DBDC5F0AD37c` | same |
| FSA executor (Composer) | `0x02954e158Be2b477E1C26F31e8aa0c21b378445C` | `0x103b384064ae85577127097A7cCadfd6fb13f437` |
| stableCoin (USDC.e) | `0xe7cd86e13AC4309349F30B3435a9d337750fC82D` | `0x21709E63fC7F264F329e0826Ea82197694B82775` |
| WNat | `0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d` | `0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273` |

Source: `flare-foundation/flare-smart-accounts` deployment configs (main branch),
FAssets repo interfaces, direct on-chain reads (2026-08-02).

## FSA vault addresses (Firelight / Upshift / FXRP vaults)

| Network | Vaults |
|---|---|
| Mainnet | `0x4C18Ff3C89632c3Dd62E796c0aFA5c07c4c1B2b3`, `0x373D7d201C8134D4a2f7b5c63560da217e3dEA28`, `0x2439D4bb753A0f3777d4C9011AFacc475ba6B951` |
| Coston2 | `0xF97B2bBdB2f4a561806e5038a503eCA81554634E`, `0x9E63a5D282F2fBb7DcE822B98e363b2719D28319`, `0x4066A1363a04ce3B23eEcB53dEfa65f94A24355E`, `0xD91324A6e8884147F6425E9ddd60e11Aea060B5b` |

Mainnet agentVault (additional): `0x09011d2A11A40DB855Cb00B3AA5a0F5F3bd485FD`

## FDC verifier (attestation requests)

| Env | URL | Key |
|---|---|---|
| Testnet | `https://fdc-verifiers-testnet.flare.network` | all-zeros (public) |
| Mainnet | `https://verifier.flare.network` (verify at use) | all-zeros |

FDC attestation types used:
- `Payment` (`0x5061796d656e74...`) — XRPL payments for the proof-based FSA flow
- `ReferencePayment` — XRPL payment with destination tag (FAssets v1.3 direct mint)

Attestation round: ~90 s. DA layer endpoints: `da-testnet.flare.network` / `da.flare.network`.

## FTSO v2 feeds

| Feed | Feed ID (bytes21) |
|---|---|
| XRP/USD | `0x015852502f55534400000000000000000000000000` |
| FLR/USD | `0x01464c522f55534400000000000000000000000000` |

Read: `FtsoV2.getFeedById(bytes21)` → `(uint256 value, int8 decimals, uint64 timestamp)`
(selector `0x93e9f806`).

## How addresses are consumed (no hardcoding)

Contracts look up the registry once in the constructor; the agent/watcher read
env vars (`CONTRACT_REGISTRY`, `FTSOV2`, `FASSET_MINTER`, `FSA_PROXY`, ...)
with the values above as documented fallbacks (see `.env.example`).
