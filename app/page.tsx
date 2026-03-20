"use client";
import { useState, useEffect } from "react";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
} from "@coinbase/onchainkit/identity";
import { usePrices } from "./components/usePrices";

const SAMPLE_BETS = [
  {
    id: 1, category: "football", status: "open",
    title: "Real Madrid will beat Arsenal in the UCL Semi-Final",
    sideFor: "Real Madrid Wins", sideAgainst: "Arsenal Wins / Draw",
    stake: "0.05", deadline: "Apr 29, 2026",
  },
  {
    id: 2, category: "crypto", status: "open",
    title: "ETH will cross $2,500 before April 30th 2026",
    sideFor: "ETH > $2,500 ✅", sideAgainst: "ETH stays below",
    stake: "0.1", deadline: "Apr 30, 2026",
  },
  {
    id: 3, category: "football", status: "matched",
    title: "Barcelona will score 3+ goals vs PSG in Champions League",
    sideFor: "Barca 3+ Goals", sideAgainst: "Under 3 Goals",
    stake: "0.02", deadline: "Apr 23, 2026",
  },
  {
    id: 4, category: "crypto", status: "open",
    title: "Solana will cross $200 by end of May 2026",
    sideFor: "SOL > $200 🚀", sideAgainst: "SOL stays below",
    stake: "0.08", deadline: "May 31, 2026",
  },
  {
    id: 5, category: "football", status: "open",
    title: "Man City will reach the UCL Final 2026",
    sideFor: "City to Final 🏆", sideAgainst: "City Knocked Out",
    stake: "0.03", deadline: "May 28, 2026",
  },
  {
    id: 6, category: "crypto", status: "open",
    title: "Bitcoin will hit $100k before June 1st 2026",
    sideFor: "BTC > $100K 🌕", sideAgainst: "BTC stays below",
    stake: "0.15", deadline: "Jun 1, 2026",
  },
];

const LEADERBOARD = [
  { rank: 1, wallet: "0x3f2a...9d1c", wins: 12, losses: 3, earned: "+1.84 ETH", wr: 80 },
  { rank: 2, wallet: "0xab7c...f332", wins: 9,  losses: 4, earned: "+0.97 ETH", wr: 69 },
  { rank: 3, wallet: "0x91de...2201", wins: 7,  losses: 5, earned: "+0.54 ETH", wr: 58 },
  { rank: 4, wallet: "0x44bc...8812", wins: 6,  losses: 6, earned: "+0.12 ETH", wr: 50 },
  { rank: 5, wallet: "0x77fa...c903", wins: 4,  losses: 8, earned: "-0.38 ETH", wr: 33 },
];

function fmt(n: number | null, prefix = "$") {
  if (n === null) return "...";
  return prefix + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    title: "", sideFor: "", sideAgainst: "", stake: "", deadline: "", category: "football",
  });
  const [countdown, setCountdown] = useState("02:14:33");
  const prices = usePrices();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        const parts = prev.split(":").map(Number);
        let total = parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (total <= 0) return "00:00:00";
        total--;
        const h = String(Math.floor(total / 3600)).padStart(2, "0");
        const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
        const s = String(total % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  function handleSubmit() {
    if (!form.title || !form.sideFor || !form.sideAgainst || !form.stake || !form.deadline) {
      showToast("⚠️ Fill in all fields first!");
      return;
    }
    showToast("🔥 Callout created! Share your link to find an opponent.");
    setShowModal(false);
    setForm({ title: "", sideFor: "", sideAgainst: "", stake: "", deadline: "", category: "football" });
  }

  const filtered = SAMPLE_BETS.filter(b => filter === "all" || b.category === filter);

  const tickerItems = [
    "⚽ UCL QUARTER-FINALS — APRIL 2026",
    `📈 ETH: ${fmt(prices.eth)}`,
    `📈 BTC: ${fmt(prices.btc)}`,
    `📈 SOL: ${fmt(prices.sol)}`,
    "🔥 12 OPEN CALLOUTS",
    "💰 TOTAL POT THIS WEEK: 4.2 ETH",
    "⚽ REAL MADRID vs ARSENAL — LIVE NOW",
  ];

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#F0F0F0", fontFamily: "Inter, sans-serif", overflowX: "hidden" }}>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,8,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #222", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 24, letterSpacing: 4, color: "#E8FF3B", textShadow: "0 0 30px rgba(232,255,59,0.4)" }}>
          CALL<span style={{ color: "#F0F0F0" }}>OUT</span>
        </div>
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </header>

      {/* TICKER */}
      <div style={{ background: "#E8FF3B", padding: "8px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 60, animation: "ticker 30s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: "flex", gap: 60 }}>
              {tickerItems.map((t, j) => (
                <span key={j} style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 12, fontWeight: 500, letterSpacing: 1, color: "#000" }}>
                  {t} &nbsp;|
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>

        {/* HERO */}
        <section style={{ padding: "60px 0 40px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "var(--font-source-code-pro)", fontSize: 11, letterSpacing: 3, color: "#E8FF3B", border: "1px solid rgba(232,255,59,0.3)", padding: "5px 14px", marginBottom: 20 }}>
            DECENTRALIZED · 1V1 · BASE NETWORK
          </div>
          <h1 style={{ fontFamily: "var(--font-source-code-pro)", fontSize: "clamp(48px,10vw,96px)", letterSpacing: 4, lineHeight: 0.95, marginBottom: 16 }}>
            CALL YOUR<br /><span style={{ color: "#E8FF3B" }}>SHOT.</span>
          </h1>
          <p style={{ color: "#666", fontSize: 15, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.6 }}>
            Predict football outcomes & crypto prices. Challenge anyone. Winner takes 90% of the pot. All onchain on Base.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowModal(true)} style={{ background: "#E8FF3B", color: "#000", border: "none", padding: "14px 32px", fontFamily: "var(--font-source-code-pro)", fontSize: 16, letterSpacing: 2, cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))" }}>
              + CREATE CALLOUT
            </button>
            <button onClick={() => document.getElementById("bets")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "#F0F0F0", border: "1px solid #333", padding: "14px 32px", fontFamily: "var(--font-source-code-pro)", fontSize: 16, letterSpacing: 2, cursor: "pointer" }}>
              VIEW OPEN BETS
            </button>
          </div>
        </section>

        {/* LIVE PRICE CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "ETHEREUM", symbol: "ETH", price: prices.eth, color: "#627EEA" },
            { label: "BITCOIN", symbol: "BTC", price: prices.btc, color: "#F7931A" },
            { label: "SOLANA", symbol: "SOL", price: prices.sol, color: "#9945FF" },
          ].map(coin => (
            <div key={coin.symbol} style={{ background: "#111", border: "1px solid #222", padding: "16px 20px", borderTop: `2px solid ${coin.color}` }}>
              <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 10, color: "#666", letterSpacing: 2, marginBottom: 6 }}>{coin.label}</div>
              <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 24, color: coin.color, letterSpacing: 1 }}>
                {fmt(coin.price)}
              </div>
              <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 10, color: "#444", marginTop: 4 }}>
                {coin.price ? "● LIVE" : "● LOADING..."}
              </div>
            </div>
          ))}
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid #222", marginBottom: 48 }}>
          {[["47","TOTAL BETS"],["12","OPEN NOW"],["6.8 ETH","TOTAL WAGERED"],["10%","PLATFORM FEE"]].map(([v,l]) => (
            <div key={l} style={{ padding: "20px 24px", borderRight: "1px solid #222", textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 30, letterSpacing: 2, color: "#E8FF3B", display: "block" }}>{v}</span>
              <span style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 11, color: "#666", letterSpacing: 1 }}>{l}</span>
            </div>
          ))}
        </div>

        {/* BETS */}
        <div id="bets">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 20, letterSpacing: 3, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "block", width: 4, height: 20, background: "#E8FF3B" }} />
              OPEN CALLOUTS
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["all","football","crypto"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 12, padding: "6px 14px", border: "1px solid", borderColor: filter === f ? "#E8FF3B" : "#333", background: filter === f ? "#E8FF3B" : "transparent", color: filter === f ? "#000" : "#666", cursor: "pointer", letterSpacing: 1 }}>
                  {f === "all" ? "ALL" : f === "football" ? "⚽ FOOTBALL" : "📈 CRYPTO"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16, marginBottom: 48 }}>
            {filtered.map(bet => (
              <div key={bet.id} style={{ background: "#111", border: "1px solid #222", padding: 20, cursor: "pointer", borderTop: `2px solid ${bet.category === "football" ? "#E8FF3B" : "#3BFFD4"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 10, letterSpacing: 2, padding: "3px 10px", border: "1px solid", color: bet.category === "football" ? "#E8FF3B" : "#3BFFD4", borderColor: bet.category === "football" ? "rgba(232,255,59,0.3)" : "rgba(59,255,212,0.3)", background: bet.category === "football" ? "rgba(232,255,59,0.05)" : "rgba(59,255,212,0.05)" }}>
                    {bet.category === "football" ? "⚽ FOOTBALL" : "📈 CRYPTO"}
                  </span>
                  <span style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 10, color: "#666", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: bet.status === "open" ? "#3BFFD4" : "#E8FF3B", display: "inline-block", boxShadow: bet.status === "open" ? "0 0 6px #3BFFD4" : "none" }} />
                    {bet.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, lineHeight: 1.4 }}>{bet.title}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ background: "#181818", border: "1px solid #222", padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 10, color: "#666", marginBottom: 4 }}>CREATOR BET</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{bet.sideFor}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 18, color: "#FF3B3B", textAlign: "center" }}>VS</div>
                  <div style={{ background: "#181818", border: "1px solid #222", padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 10, color: "#666", marginBottom: 4 }}>YOUR SIDE</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{bet.sideAgainst}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #222" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 22, color: "#E8FF3B", lineHeight: 1 }}>{bet.stake} ETH</div>
                    <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 10, color: "#666" }}>
                      {bet.status === "matched" ? `TIMER: ${countdown}` : `POT: ${(parseFloat(bet.stake)*2).toFixed(3)} ETH`}
                    </div>
                  </div>
                  {bet.status === "open" && (
                    <button onClick={() => showToast("⚡ Connect wallet to take this bet!")} style={{ background: "#E8FF3B", color: "#000", border: "none", padding: "8px 18px", fontFamily: "var(--font-source-code-pro)", fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
                      TAKE BET
                    </button>
                  )}
                  {bet.status === "matched" && (
                    <span style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 10, color: "#666" }}>DEADLINE<br/>{bet.deadline}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEADERBOARD */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 20, letterSpacing: 3, display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ display: "block", width: 4, height: 20, background: "#E8FF3B" }} />
            LEADERBOARD
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["#","WALLET","W","L","WIN RATE","ETH EARNED"].map(h => (
                  <th key={h} style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 11, letterSpacing: 2, color: "#666", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #222" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map(row => (
                <tr key={row.rank} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "14px 16px", fontFamily: "var(--font-source-code-pro)", fontSize: 20, color: row.rank === 1 ? "#FFD700" : row.rank === 2 ? "#C0C0C0" : row.rank === 3 ? "#CD7F32" : "#666" }}>{row.rank}</td>
                  <td style={{ padding: "14px 16px", fontFamily: "var(--font-source-code-pro)", fontSize: 12 }}>{row.wallet}</td>
                  <td style={{ padding: "14px 16px", fontFamily: "var(--font-source-code-pro)", fontSize: 20, color: "#3BFFD4" }}>{row.wins}</td>
                  <td style={{ padding: "14px 16px", fontFamily: "var(--font-source-code-pro)", fontSize: 20, color: "#FF3B3B" }}>{row.losses}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ height: 4, background: "#222", borderRadius: 2, width: 80 }}>
                      <div style={{ height: "100%", width: `${row.wr}%`, background: row.wr >= 50 ? "#3BFFD4" : "#FF3B3B", borderRadius: 2 }} />
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontFamily: "var(--font-source-code-pro)", fontSize: 12, color: row.earned.startsWith("+") ? "#E8FF3B" : "#FF3B3B" }}>{row.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #222", padding: 24, textAlign: "center", fontFamily: "var(--font-source-code-pro)", fontSize: 11, color: "#666", letterSpacing: 1 }}>
        CALLOUT · Built on Base · by Praxis AI · 10% platform fee on all winnings
      </footer>

      {/* CREATE MODAL */}
      {showModal && (
        <div onClick={(e) => e.target === e.currentTarget && setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#111", border: "1px solid #222", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--font-source-code-pro)", fontSize: 22, letterSpacing: 3, color: "#E8FF3B" }}>CREATE CALLOUT</div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "1px solid #333", color: "#666", width: 32, height: 32, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <div style={{ padding: "0 24px 24px" }}>
              {[
                { label: "CATEGORY", key: "category", type: "select", options: ["football","crypto","other"] },
                { label: "CALLOUT TITLE", key: "title", type: "text", placeholder: "e.g. Real Madrid will beat Barcelona" },
                { label: "YOUR SIDE (FOR)", key: "sideFor", type: "text", placeholder: "Real Madrid Wins" },
                { label: "OPPONENT SIDE (AGAINST)", key: "sideAgainst", type: "text", placeholder: "Barcelona Wins / Draw" },
                { label: "STAKE AMOUNT (ETH)", key: "stake", type: "number", placeholder: "0.05" },
                { label: "DEADLINE", key: "deadline", type: "datetime-local" },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontFamily: "var(--font-source-code-pro)", fontSize: 11, letterSpacing: 2, color: "#666", marginBottom: 8 }}>{field.label}</label>
                  {field.type === "select" ? (
                    <select value={form[field.key as keyof typeof form]} onChange={e => setForm({...form, [field.key]: e.target.value})} style={{ width: "100%", background: "#181818", border: "1px solid #222", color: "#F0F0F0", padding: "11px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, outline: "none" }}>
                      {field.options?.map(o => <option key={o} value={o}>{o === "football" ? "⚽ Football / Sports" : o === "crypto" ? "📈 Crypto Price" : "🎯 Other"}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} placeholder={field.placeholder} value={form[field.key as keyof typeof form]} onChange={e => setForm({...form, [field.key]: e.target.value})} style={{ width: "100%", background: "#181818", border: "1px solid #222", color: "#F0F0F0", padding: "11px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, outline: "none" }} />
                  )}
                </div>
              ))}
              <div style={{ padding: "12px 14px", background: "rgba(232,255,59,0.04)", border: "1px solid rgba(232,255,59,0.15)", fontFamily: "var(--font-source-code-pro)", fontSize: 11, color: "#666", marginBottom: 18, lineHeight: 1.5 }}>
                ⚡ Winner takes <strong style={{ color: "#E8FF3B" }}>90%</strong> of pot. <strong style={{ color: "#E8FF3B" }}>10%</strong> platform fee. ETH held in smart contract until resolution.
              </div>
              <button onClick={handleSubmit} style={{ width: "100%", background: "#E8FF3B", color: "#000", border: "none", padding: 16, fontFamily: "var(--font-source-code-pro)", fontSize: 18, letterSpacing: 3, cursor: "pointer" }}>
                LOCK IN CALLOUT →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#111", border: "1px solid #E8FF3B", padding: "14px 20px", fontFamily: "var(--font-source-code-pro)", fontSize: 13, color: "#E8FF3B", zIndex: 999, maxWidth: 320 }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; }
      `}</style>
    </div>
  );
}
