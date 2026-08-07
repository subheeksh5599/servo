// Attest a real XRPL testnet payment and dump the finalized proof as JSON.
// Usage: TX_HASH=0x... PROOF_OWNER=0x... node attest.mjs > proof.json
import "dotenv/config";
import fs from "node:fs";
import { FdcClient } from "../watcher/fdc-client.mjs";

const env = process.env;
const txHash = env.TX_HASH;
if (!txHash) {
  console.error("TX_HASH required (0x-prefixed XRPL tx hash)");
  process.exit(1);
}
const proofOwner = env.PROOF_OWNER;
if (!proofOwner) {
  console.error("PROOF_OWNER required (EVM address that will call verifyXRPPayment)");
  process.exit(1);
}

const fdc = new FdcClient({
  verifierUrl: env.FDC_VERIFIER_URL || "https://fdc-verifiers-testnet.flare.network",
  verifierKey: env.FDC_VERIFIER_KEY,
  daUrl: env.FDC_DA_URL || "https://ctn2-data-availability.flare.network",
  sourceId: env.FDC_SOURCE_ID || "testXRP",
});

console.error(`[attest] preparing XRPPayment for ${txHash} (owner ${proofOwner})`);
const prepared = await fdc.prepareXrpPayment(txHash, proofOwner);
console.error(`[attest] requestId=${prepared.requestId} status=${prepared.status}`);
if (prepared.status !== "OK") process.exit(1);

const final = await fdc.waitForFinalized(FdcClient.ATTESTATION.xrpPayment, prepared.requestId);
console.error("[attest] finalized", JSON.stringify({ status: final.status, round: final.attestationProof?.data?.votingRound }));
fs.writeFileSync("proof.json", JSON.stringify(final.attestationProof, null, 2));
console.error("[attest] wrote proof.json");
