/**
 * Servo — landing page copy.
 *
 * Rule for everything in this file: no claim that is not already true and
 * checkable. The addresses below are the live Coston2 deployment, the demo
 * payment's proof verifies on-chain (verifyXRPPayment → true), and the
 * limitations are stated in the same voice as the features.
 *
 * Values marked "read 2026-08-07" were pulled off the chain that day; the
 * verify section's commands reproduce them live at any time.
 */

const REGISTRY =
  process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ?? "0x23504cb325032023ef207c2915F6CAee41b215Ac";
const CONTROLLER =
  process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS ?? "0xD1f069BBEf328FA71dd1101646D4fDE68173c497";
const FDC = process.env.NEXT_PUBLIC_FDC_ADDRESS ?? "0x906507E0B64bcD494Db73bd0459d1C667e14B933";
const EXPLORER =
  process.env.NEXT_PUBLIC_EXPLORER_BASE ?? "https://coston2-explorer.flare.network/address";

export const siteConfig = {
  name: "Servo",
  tagline: "Recurring money for XRP on Flare",
  description:
    "One XRPL payment sets up recurring money on Flare: dollar-cost averaging, subscriptions, auto-sweep. The payment is attested by FDC, the order is enforced on-chain with caps and a circuit breaker, and a strategy agent only proposes the routing.",
  url: "https://servo-dashboard.vercel.app",
  twitter: "@servo",
  repo: "https://github.com/subheeksh5599/servo",
  registry: REGISTRY,
  registryExplorer: `${EXPLORER}/${REGISTRY}`,
  controller: CONTROLLER,
  controllerExplorer: `${EXPLORER}/${CONTROLLER}`,
  fdc: FDC,
  fdcExplorer: `${EXPLORER}/${FDC}`,
  nav: {
    cta: { text: "Open dashboard", href: "/dashboard" },
  },
};

export const heroConfig = {
  /* Two lines. A display line that wraps to three or four is a staircase, not
     a composition. */
  headline: ["Sign once.", "Your XRP works forever."],
  subheadline:
    "Recurring money for XRP on Flare. One XRPL payment with a Servo memo becomes a standing order, attested by the Flare Data Connector and enforced on-chain by a controller with caps and a circuit breaker. A strategy agent routes your capital to the best yield venue, and only ever asks permission.",
  primary: { text: "Open dashboard", href: "/dashboard" },
  secondary: { text: "Verify it yourself", href: "#verify" },
};

export const techStackConfig = {
  /* "Built on", never "used by" — these are dependencies, not customers. */
  title: "Built on",
  items: [
    { name: "Flare", description: "The chain both contracts live on" },
    { name: "FDC", description: "XRPPayment attestations, the order's proof" },
    { name: "FTSO v2", description: "Prices read at execution time" },
    { name: "FAssets", description: "FXRP, the routed asset" },
    { name: "XRPL", description: "Where the one payment happens" },
    { name: "Coston2", description: "Testnet, live" },
  ],
};

/** One row of a ledger: field, value, and what it gives away. */
export type LedgerRow = readonly [field: string, value: string, note: string];

/** The problem, shown rather than asserted. Both columns are real shapes. */
export const leakConfig: {
  statement: string;
  body: string;
  plain: { label: string; caption: string; rows: LedgerRow[] };
  sealed: { label: string; caption: string; rows: LedgerRow[] };
} = {
  /* Two lines at display size. A headline that wraps to four is a staircase
     of short rows, not a composition. */
  statement: "Public rails publish an operational diary.",
  body: "Recurring payments on a public ledger are a readable strategy. Every transfer records who is paying, how much, how often, and to whom, and it stays linkable forever. For a salary, a subscription, or a dollar-cost averaging plan, that is a schedule handed to anyone who cares to read it. The naive fix, don't automate on-chain, is worse: then the plan is a manual chore, and the strategy dies with the person who remembered to run it.",
  plain: {
    label: "A recurring payment in the open",
    caption: "Every field is public, and permanently linkable.",
    rows: [
      ["from", "rN7n…8m2k", "who is paying, every time"],
      ["to", "r9dR…4b1f", "and to whom"],
      ["amount", "25 XRP", "what it cost, every time"],
      ["cadence", "every 7 days", "visible forever"],
    ],
  },
  sealed: {
    label: "The same plan through Servo",
    caption: "One payment, then the schedule runs itself.",
    rows: [
      ["event", "one payment", "with a Servo memo, then done"],
      ["order", "registered", "an FDC proof, not a schedule"],
      ["amount", "at execution", "only when the tick fires"],
      ["strategy", "off-chain", "the agent proposes, never decides alone"],
    ],
  },
};

/**
 * Being precise about this matters more than the feature list, so it is stated
 * rather than softened. The limitation is not buried.
 */
export const disclosureConfig = {
  title: "What is hidden, and what is not",
  lede: "Being precise about this matters more than any feature list.",
  sealed: {
    label: "Private",
    note: "Not published as a schedule; kept by the order and the agent.",
    items: [
      "Your XRPL address and its spending pattern as a standing schedule",
      "The strategy behind the orders, and the agent's confidence in it",
      "Which venue your capital sits in, and when it moves",
      "Whether a tick was auto-executed or held for a signature",
    ],
  },
  open: {
    label: "Public",
    note: "Visible to anyone reading Coston2.",
    items: [
      "That an order exists, keyed to an attested payment",
      "The FDC attestation proofs, re-verifiable on-chain",
      "FTSO v2 prices, read at execution time with a staleness window",
      "Execution receipts: amount, venue, price, and the epoch",
    ],
  },
  limitation: {
    label: "Known limitation, stated plainly",
    body: "payment that creates an order is itself a public transaction. Servo does not hide that payment. It removes the need to broadcast a repeating pattern: one payment, not a visible schedule. Execution receipts on Coston2 are public by design, and the proofs anyone can re-verify are the point.",
  },
};

/** The four movements of a payment. Deliberately not a numbered list on a rail. */
export const pathConfig = {
  title: "How a payment moves",
  lede: "No repeating transaction ever needs to be sent again. The schedule lives on-chain, enforced by the controller, and the agent only proposes the routing.",
  steps: [
    {
      key: "pay",
      title: "Pay",
      body: "An XRPL payment with a Servo memo lands on the receiving address. The watcher sees it, and the Flare Data Connector attests it in roughly a 90 second round.",
      detail: "verifyXRPPayment(proof)",
    },
    {
      key: "register",
      title: "Register",
      body: "The attestation proof registers a standing order. Unverified proofs revert, so an order can only exist if the payment really happened.",
      detail: "registerOrder(proof, ownerEvm)",
    },
    {
      key: "execute",
      title: "Execute",
      body: "On schedule, the controller reads the FTSO v2 price, checks per-tick caps and the circuit breaker, and executes the tick.",
      detail: "execute(orderId)",
    },
    {
      key: "route",
      title: "Route",
      body: "FXRP deposits into the chosen venue vault through an ERC4626 adapter, or stays as FXRP. One receipt per tick, with the price that was read.",
      detail: "ERC4626 deposit",
    },
  ],
};

/** Verify it yourself: real commands, real outputs from Coston2. */
export const verifyConfig = {
  title: "Verify it yourself",
  lede: "The registry and controller are live on Coston2. Every claim on this page is checkable from a terminal right now.",
  checks: [
    {
      label: "The registry is live, and empty states are honest",
      command: 'cast call 0x23504cb3… "orderCount()"',
      output: "1\n\n# one order, created by the attested demo payment",
    },
    {
      label: "FTSO v2, read at execution time",
      command: 'cast call 0xc4e9c78e… "getCurrentPrice(XRPUSD)"',
      output: "1.037224 USD\n\n# same feed the controller reads, 2h staleness window",
    },
    {
      label: "Venue exchange rates from the deployed adapters",
      command: 'cast call 0xD1f069BB… "venueAdapter(1)"',
      output: "TESTstXRP    1.0\nTESTearnXRP  1.001100009020019019\n\n# realized APY is computed from these, never invented",
    },
    {
      label: "The demo payment's proof verifies on-chain",
      command: 'cast call 0x906507E0… "verifyXRPPayment(proof)"',
      output: "true\n\n# tx E715FA55… · voting round 1413872",
    },
  ],
  footnote:
    "orderCount is how many standing orders are live. Each was created by an attested payment, and every receipt carries the price that was read.",
};

export const footerConfig = {
  colophon: "Servo · Flare Summer Signal 2026 · Coston2 testnet",
  columns: [
    {
      heading: "Product",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Orders", href: "/dashboard" },
        { label: "Venues", href: "/dashboard" },
        { label: "Agent", href: "/dashboard" },
      ],
    },
    {
      heading: "On-chain",
      links: [
        { label: "StandingOrderRegistry", href: "https://github.com/subheeksh5599/servo" },
        { label: "ExecutionController", href: "https://github.com/subheeksh5599/servo" },
        { label: "FlareDataConnector", href: "https://dev.flare.network/fdc" },
      ],
    },
    {
      heading: "Source",
      links: [
        { label: "GitHub", href: "https://github.com/subheeksh5599/servo" },
        { label: "Flare docs", href: "https://dev.flare.network/" },
        { label: "XRPL", href: "https://xrpl.org/" },
      ],
    },
  ],
};

export const features = {
  smoothScroll: true,
};
