import type { ServoData, Venue } from "./types";
import { LabelPill, Avatar } from "./Glyphs";

export function VenuesView({ data }: { data: ServoData }) {
  const rows = data.venues as Venue[];
  return (
    <div className="p-6">
      <p className="font-body text-[13px] text-mist">
        Adapters route FXRP into yield vaults. Rates below are read on-chain
        (exchangeRate() → convertToAssets(1e18)).
      </p>
      {!data.deployed && (
        <p className="mt-8 font-body text-[13px] text-mist">
          Not deployed yet · venues appear here after <span className="font-mono">forge script script/Deploy.s.sol</span>.
        </p>
      )}
      {data.deployed && rows.length === 0 && (
        <p className="mt-8 font-body text-[13px] text-mist">No venue adapters registered on the controller.</p>
      )}
      <div className="mt-6 space-y-0.5">
        {rows.map((v) => (
          <div key={v.venueId} className="flex items-center gap-3 border-b border-white/7 px-2 py-3 hover:bg-white/[0.035]">
            <span className="w-[64px] font-mono text-[12px] text-mist">V-{v.venueId}</span>
            <span className="flex-1 font-body text-[13.5px] font-medium text-ink">{v.name}</span>
            <LabelPill text="fxrp" />
            <span className="font-mono text-[12px] text-[#b9bdc6]">
              rate {(Number(v.rate) / 1e18).toFixed(6)}
            </span>
            <span className="w-[160px] truncate font-mono text-[11px] text-mist">{v.adapter.slice(0, 18)}…</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReceiptsView({ data }: { data: ServoData }) {
  const rows = data.receipts;
  return (
    <div className="p-6">
      <p className="font-body text-[13px] text-mist">
        ExecutionReceipt events from the controller · amount, price, route,
        timestamp, tx hash.
      </p>
      {rows.length === 0 && (
        <p className="mt-8 font-body text-[13px] text-mist">
          No receipts yet. They appear here the moment an order executes.
        </p>
      )}
      <div className="mt-6 space-y-0.5">
        {rows.slice().reverse().map((r, i) => (
          <div key={`${r.txHash}-${i}`} className="flex items-center gap-3 border-b border-white/7 px-2 py-3 hover:bg-white/[0.035]">
            <span className="w-[64px] font-mono text-[12px] text-mist">SRV-{String(r.orderId).padStart(3, "0")}</span>
            <span className="flex-1 truncate font-body text-[13.5px] font-medium text-ink">
              {r.amountDrops} drops @ {r.priceXrpUsd} (1e6) → venue {r.venueId}
            </span>
            <span className="font-mono text-[11px] text-mist">
              {new Date(r.timestamp * 1000).toISOString().slice(0, 16).replace("T", " ")}
            </span>
            <span className="w-[180px] truncate font-mono text-[11px] text-mist/60">{r.txHash}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgentView({ data }: { data: ServoData }) {
  return (
    <div className="p-6">
      <p className="font-body text-[13px] text-mist">
        The strategy agent scores venues by realized APY, executes at ≥70%
        confidence, and asks for one signature below it. Decisions are logged
        here.
      </p>
      {!data.deployed && (
        <p className="mt-8 font-body text-[13px] text-mist">
          Agent runs off-chain (agent/agent.mjs) against the deployed registry.
          Nothing to score until contracts are on Coston2.
        </p>
      )}
      <div className="mt-6 rounded-lg border border-white/7 bg-pane p-4 font-mono text-[12px] leading-relaxed text-mist">
        <p className="text-sage/60"># agent · no decisions logged yet</p>
        <p>threshold: 70% · tick: 60s · venues scored: {data.venues.length}</p>
        <p>orders watched: {data.orders.length}</p>
      </div>
    </div>
  );
}

export function SettingsView({ data }: { data: ServoData }) {
  return (
    <div className="p-6">
      <p className="font-body text-[13px] text-mist">Deployed contracts and environment.</p>
      <div className="mt-6 space-y-2 font-mono text-[12px]">
        <div className="flex items-center gap-3 border-b border-white/7 px-2 py-3">
          <span className="w-[140px] text-mist">Registry</span>
          <span className="text-[#b9bdc6]">{data.registry ?? "not configured"}</span>
        </div>
        <div className="flex items-center gap-3 border-b border-white/7 px-2 py-3">
          <span className="w-[140px] text-mist">Controller</span>
          <span className="text-[#b9bdc6]">{data.controller ?? "not configured"}</span>
        </div>
        <div className="flex items-center gap-3 border-b border-white/7 px-2 py-3">
          <span className="w-[140px] text-mist">Deployed</span>
          <span className={data.deployed ? "text-[#27ae60]" : "text-[#eb5757]"}>
            {data.deployed ? "true" : "false"}
          </span>
        </div>
        {data.note && (
          <div className="mt-6 rounded-lg border border-white/7 bg-pane p-4 leading-relaxed text-mist">
            {data.note}
          </div>
        )}
      </div>
    </div>
  );
}
