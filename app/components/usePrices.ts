"use client";
import { useState, useEffect } from "react";

export type Prices = {
  eth: number | null;
  btc: number | null;
  sol: number | null;
};

export function usePrices() {
  const [prices, setPrices] = useState<Prices>({ eth: null, btc: null, sol: null });

  async function fetchPrices() {
    try {
      const res = await fetch(
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC,SOL&tsyms=USD",
        { cache: "no-store" }
      );
      const data = await res.json();
      setPrices({
        eth: data.ETH.USD,
        btc: data.BTC.USD,
        sol: data.SOL.USD,
      });
    } catch (e) {
      console.error("Price fetch failed:", e);
    }
  }

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return prices;
}
