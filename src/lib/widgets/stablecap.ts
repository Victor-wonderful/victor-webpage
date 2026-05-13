// Stablecoin market-cap snapshot via CoinGecko /coins/markets.
// Pulls USDT, USDC, DAI, FDUSD with 7-day change.

export type StableCoin = {
  symbol: string;
  name: string;
  marketCap: number;
  change7dPct: number;
};

type Raw = {
  symbol: string;
  name: string;
  market_cap: number;
  price_change_percentage_7d_in_currency?: number;
};

const TARGET_IDS = ["tether", "usd-coin", "dai", "first-digital-usd"];

export async function fetchStablecoinMcap(): Promise<{
  total: number;
  total7dDeltaPct: number;
  coins: StableCoin[];
}> {
  try {
    const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("ids", TARGET_IDS.join(","));
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("price_change_percentage", "7d");

    const res = await fetch(url.toString(), {
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error("coingecko");
    const raw = (await res.json()) as Raw[];

    const coins: StableCoin[] = raw.map((r) => ({
      symbol: r.symbol.toUpperCase(),
      name: r.name,
      marketCap: r.market_cap ?? 0,
      change7dPct: r.price_change_percentage_7d_in_currency ?? 0,
    }));

    const total = coins.reduce((s, c) => s + c.marketCap, 0);
    // Weighted 7d change by market cap (proxy — coin prices are pegged so change is mostly supply-driven)
    const total7dDeltaPct =
      total > 0
        ? coins.reduce((s, c) => s + (c.change7dPct * c.marketCap) / total, 0)
        : 0;

    return { total, total7dDeltaPct, coins };
  } catch {
    return { total: 0, total7dDeltaPct: 0, coins: [] };
  }
}
