#!/usr/bin/env bash
# Finish the live Coston2 loop in one command.
#
# The fixed contracts are already deployed (registry 0x23504c…, controller
# 0xD1f069…). What remains is the live loop against them:
#
#   RELAYER_PK=<key> bash scripts/finish-live.sh
#
# It does four things, each independently verifiable:
#   1. Re-attests the demo XRPL payment (tx E715FA55...) with the live registry
#      as proofOwner — the old committed proof is bound to the pre-fix address.
#   2. Verifies the fresh proof on-chain against the deployed FDC.
#   3. Registers the order on the live registry (ownerEvm = relayer).
#   4. Prints the addresses to keep in the Vercel envs.
#
# Note: step 1 overwrites scripts/proof.json with the new proof — commit it
# afterwards, it is the live demo evidence for the live registry.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/scripts"

: "${RELAYER_PK:?set RELAYER_PK}"
REGISTRY="${SERVO_REGISTRY:-0x23504cb325032023ef207c2915F6CAee41b215Ac}"
CONTROLLER="${SERVO_CONTROLLER:-0xD1f069BBEf328FA71dd1101646D4fDE68173c497}"
OWNER_EVM="${OWNER_EVM:-0x4ccafDF7c8aFa0C7a8FE8ABACB1Cf726f82A5509}"
COSTON2_RPC="${COSTON2_RPC:-https://coston2-api.flare.network/ext/C/rpc}"
TX_HASH="0xe715fa5510cb2795ce656276761b49017fee1a808934e07feeda958e8496d84d"

echo "== 1/4 re-attesting demo tx with the live registry as proofOwner =="
TX_HASH="$TX_HASH" PROOF_OWNER="$REGISTRY" RELAYER_PK="$RELAYER_PK" \
  COSTON2_RPC="$COSTON2_RPC" node "$ROOT/scripts/attest.mjs"

echo "== 2/4 verifying fresh proof on-chain against the deployed FDC =="
SERVO_REGISTRY="$REGISTRY" OWNER_EVM="$OWNER_EVM" \
  COSTON2_RPC="$COSTON2_RPC" PROOF=proof.json \
  node "$ROOT/scripts/register-order.mjs" --dry

echo "== 3/4 registering the order on the live registry =="
SERVO_REGISTRY="$REGISTRY" OWNER_EVM="$OWNER_EVM" \
  RELAYER_PK="$RELAYER_PK" COSTON2_RPC="$COSTON2_RPC" PROOF=proof.json \
  node "$ROOT/scripts/register-order.mjs"

echo "== 4/4 Vercel envs (project servo-dashboard) =="
echo "SERVO_REGISTRY=$REGISTRY"
echo "SERVO_CONTROLLER=$CONTROLLER"
echo "Done. Then set the watcher + agent loose on an always-on host."
