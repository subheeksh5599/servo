// Register a real attested payment as a standing order on the deployed registry.
// Usage: PROOF=proof.json node register-order.mjs [--dry]
import "dotenv/config";
import fs from "node:fs";
import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";

const env = process.env;
const REGISTRY = env.SERVO_REGISTRY;
const OWNER_EVM = env.OWNER_EVM;
const dry = process.argv.includes("--dry");
if (!REGISTRY || !OWNER_EVM) {
  console.error("missing env: SERVO_REGISTRY, OWNER_EVM");
  process.exit(1);
}
if (!dry && !env.RELAYER_PK) {
  console.error("missing env: RELAYER_PK (only needed for the live write; --dry verifies on-chain without it)");
  process.exit(1);
}

const chain = defineChain({
  id: Number(env.SERVO_CHAIN_ID || 114),
  name: "Coston2",
  network: "coston2",
  nativeCurrency: { name: "Coston2 FLR", symbol: "C2FLR", decimals: 18 },
  rpcUrls: { default: { http: [env.COSTON2_RPC] } },
});
const account = dry ? null : privateKeyToAccount(env.RELAYER_PK);
const wallet = dry ? null : createWalletClient({ account, chain, transport: http(env.COSTON2_RPC) });
const publicClient = createPublicClient({ chain, transport: http(env.COSTON2_RPC) });

// v1.3 IXRPPayment.Proof: { merkleProof, data } — NO salt field
const ABI = parseAbi([
  "function registerOrder((bytes32[] merkleProof,(bytes32 attestationType,bytes32 sourceId,uint64 votingRound,uint64 lowestUsedTimestamp,(bytes32 transactionId,address proofOwner) requestBody,(uint64 blockNumber,uint64 blockTimestamp,string sourceAddress,bytes32 sourceAddressHash,bytes32 receivingAddressHash,bytes32 intendedReceivingAddressHash,int256 spentAmount,int256 intendedSpentAmount,int256 receivedAmount,int256 intendedReceivedAmount,bool hasMemoData,bytes firstMemoData,bool hasDestinationTag,uint256 destinationTag,uint8 status) responseBody) data) proof,address ownerEvm) returns (uint256 orderId)",
  "function orderCount() view returns (uint256)",
]);

const raw = JSON.parse(fs.readFileSync(env.PROOF, "utf8"));
const rb = raw.response.requestBody;
const rsb = raw.response.responseBody;

const proof = {
  merkleProof: raw.proof,
  data: {
    attestationType: raw.response.attestationType,
    sourceId: raw.response.sourceId,
    votingRound: raw.response.votingRound,
    lowestUsedTimestamp: raw.response.lowestUsedTimestamp,
    requestBody: { transactionId: rb.transactionId, proofOwner: rb.proofOwner },
    responseBody: {
      blockNumber: rsb.blockNumber,
      blockTimestamp: rsb.blockTimestamp,
      sourceAddress: rsb.sourceAddress,
      sourceAddressHash: rsb.sourceAddressHash,
      receivingAddressHash: rsb.receivingAddressHash,
      intendedReceivingAddressHash: rsb.intendedReceivingAddressHash,
      spentAmount: rsb.spentAmount,
      intendedSpentAmount: rsb.intendedSpentAmount,
      receivedAmount: rsb.receivedAmount,
      intendedReceivedAmount: rsb.intendedReceivedAmount,
      hasMemoData: rsb.hasMemoData,
      firstMemoData: rsb.firstMemoData,
      hasDestinationTag: rsb.hasDestinationTag,
      destinationTag: rsb.destinationTag,
      status: rsb.status,
    },
  },
};

if (dry) {
  // verify the proof off-chain against the deployed FdcVerification
  const FDC = process.env.FDC_VERIFICATION || "0x906507E0B64bcD494Db73bd0459d1C667e14B933";
  const ok = await publicClient.readContract({
    address: FDC,
    abi: parseAbi([
      "function verifyXRPPayment((bytes32[] merkleProof,(bytes32 attestationType,bytes32 sourceId,uint64 votingRound,uint64 lowestUsedTimestamp,(bytes32 transactionId,address proofOwner) requestBody,(uint64 blockNumber,uint64 blockTimestamp,string sourceAddress,bytes32 sourceAddressHash,bytes32 receivingAddressHash,bytes32 intendedReceivingAddressHash,int256 spentAmount,int256 intendedSpentAmount,int256 receivedAmount,int256 intendedReceivedAmount,bool hasMemoData,bytes firstMemoData,bool hasDestinationTag,uint256 destinationTag,uint8 status) responseBody) data) proof) view returns (bool)",
    ]),
    functionName: "verifyXRPPayment",
    args: [proof],
  });
  console.log("verifyXRPPayment on-chain:", ok);
  process.exit(0);
}

console.log("registering order for tx", rb.transactionId, "venue memo present:", rsb.hasMemoData);
const tx = await wallet.writeContract({
  address: REGISTRY,
  abi: ABI,
  functionName: "registerOrder",
  args: [proof, OWNER_EVM],
});
const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
console.log("registerOrder tx:", tx, "status:", receipt.status);
if (receipt.status === "success") {
  const count = await publicClient.readContract({ address: REGISTRY, abi: ABI, functionName: "orderCount" });
  console.log("orderCount now:", count.toString());
}
