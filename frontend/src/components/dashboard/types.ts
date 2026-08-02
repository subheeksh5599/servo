export interface Order {
  id: number;
  ownerXrpl: string;
  ownerEvm: string;
  amountXrp: string;
  cadenceHours: number;
  venueId: number;
  venueLabel: string;
  autoExecute: boolean;
  active: boolean;
  nextExecutionAt: number;
  totalExecutedDrops: string;
  executionCount: number;
  ownerInitials: string;
  nextAt: string;
  status: "running" | "due" | "paused";
}

export interface Venue {
  venueId: number;
  adapter: string;
  name: string;
  rate: string;
}

export interface Receipt {
  orderId: number;
  amountDrops: string;
  priceXrpUsd: string;
  venueId: number;
  transactionId: string;
  timestamp: number;
  txHash: string;
}

export interface ServoData {
  deployed: boolean;
  registry: string | null;
  controller: string | null;
  orders: Array<Record<string, unknown>>;
  venues: Venue[];
  receipts: Receipt[];
  note?: string;
}
