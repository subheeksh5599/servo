// FDC verifier client (Flare Data Connector attestation requests).
// Docs: https://dev.flare.network/fdc/getting-started

export class FdcClient {
  constructor({ verifierUrl, verifierKey, daUrl, sourceId }) {
    this.verifierUrl = verifierUrl;
    this.verifierKey = verifierKey || "0".repeat(64);
    this.daUrl = daUrl;
    this.sourceId = this.#pad32(sourceId);
  }

  static ATTESTATION = {
    referencePayment: "ReferencePayment",
    payment: "Payment",
  };

  #pad32(str) {
    return "0x" + Buffer.from(str, "utf8").toString("hex").padEnd(64, "0");
  }

  async #post(path, body) {
    const res = await fetch(`${this.verifierUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": this.verifierKey },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`verifier ${path} -> ${res.status}: ${await res.text()}`);
    }
    return res.json();
  }

  /** Request an attestation for an XRPL transaction. Returns {requestId, status}. */
  async prepareReferencePayment(txHashHex) {
    return this.#post("/verifier/prepareRequest", {
      attestationType: this.#pad32(FdcClient.ATTESTATION.referencePayment),
      sourceId: this.sourceId,
      requestBody: { transactionId: txHashHex },
    });
  }

  /** Poll until the attestation round finalizes. Returns {status, attestationProof}. */
  async waitForFinalized(attestationType, requestId, { timeoutMs = 6 * 60_000, pollMs = 10_000 } = {}) {
    const deadline = Date.now() + timeoutMs;
    let last = null;
    while (Date.now() < deadline) {
      const res = await this.#post("/verifier/waitForFinalizedRequest", {
        attestationType,
        sourceId: this.sourceId,
        requestId,
      });
      last = res;
      if (res.status === "OK" && (res.attestationProof || res.merkleProof)) return res;
      if (res.status === "INVALID" || res.status === "ERROR") throw new Error(`attestation failed: ${res.status}`);
      await new Promise((r) => setTimeout(r, pollMs));
    }
    throw new Error(`attestation timeout; last=${JSON.stringify(last)}`);
  }

  /** Fetch the full attestation (proof + data) from the DA layer. */
  async fetchFromDa(votingRound, attestationType, requestId) {
    const url = `${this.daUrl}/data/${votingRound}/${attestationType}/${this.sourceId}/${requestId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`DA ${url} -> ${res.status}`);
    return res.json();
  }
}
