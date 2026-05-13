// Binance USDT-perp funding rate fetcher (no auth).
// Endpoint: GET /fapi/v1/premiumIndex returns all symbols' current funding.

export type FundingRow = {
  symbol: string;
  rate: number; // funding rate (decimal, e.g. 0.0001 = 0.01% per 8h)
  ratePct: number; // rate × 100
  annualizedPct: number; // ratePct × 3 × 365
};

type RawRow = {
  symbol: string;
  lastFundingRate: string;
};

export async function fetchFundingRates(
  limit = 10,
): Promise<{ top: FundingRow[]; bottom: FundingRow[] }> {
  try {
    const res = await fetch(
      "https://fapi.binance.com/fapi/v1/premiumIndex",
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error("binance");
    const raw = (await res.json()) as RawRow[];

    const rows: FundingRow[] = raw
      .filter((r) => r.symbol.endsWith("USDT"))
      .map((r) => {
        const rate = Number(r.lastFundingRate) || 0;
        const ratePct = rate * 100;
        return {
          symbol: r.symbol.replace(/USDT$/, ""),
          rate,
          ratePct,
          annualizedPct: ratePct * 3 * 365,
        };
      })
      .filter((r) => r.rate !== 0);

    const sorted = [...rows].sort((a, b) => b.rate - a.rate);
    return {
      top: sorted.slice(0, limit),
      bottom: sorted.slice(-limit).reverse(),
    };
  } catch {
    return { top: [], bottom: [] };
  }
}
