// Top Gainers / Losers — CoinGecko /coins/markets (free, no key)
// vs_currency=krw → KRW prices directly. We also fetch USD in parallel for dual display.

export type Coin = {
  symbol: string;
  name: string;
  priceKrw: number;
  priceUsd: number;
  change24h: number; // %
  rank: number; // market cap rank
};

export type MoversData = {
  gainers: Coin[];
  losers: Coin[];
  fetchedAt: number;
};

// Stablecoins (and pegged) to exclude from movers — they shouldn't appear anyway, but defensive
const STABLES = new Set([
  "usdt", "usdc", "dai", "busd", "tusd", "fdusd", "usdp", "usdd", "frax",
  "gusd", "lusd", "pyusd", "usde", "usds", "crvusd", "usdy",
]);

const TOP_RANK = 200; // only consider top-200 by market cap

const MOCK_GAINERS: Coin[] = [
  { symbol: "TAO", name: "Bittensor", priceKrw: 565000, priceUsd: 412.8, change24h: 18.4, rank: 38 },
  { symbol: "FET", name: "Fetch.ai", priceKrw: 2510, priceUsd: 1.83, change24h: 12.1, rank: 52 },
  { symbol: "RENDER", name: "Render", priceKrw: 11530, priceUsd: 8.42, change24h: 9.6, rank: 71 },
  { symbol: "INJ", name: "Injective", priceKrw: 36020, priceUsd: 26.3, change24h: 7.8, rank: 42 },
  { symbol: "SUI", name: "Sui", priceKrw: 5640, priceUsd: 4.12, change24h: 6.5, rank: 28 },
];
const MOCK_LOSERS: Coin[] = [
  { symbol: "PEPE", name: "Pepe", priceKrw: 0.0134, priceUsd: 0.0000098, change24h: -14.2, rank: 32 },
  { symbol: "WLD", name: "Worldcoin", priceKrw: 2660, priceUsd: 1.94, change24h: -10.8, rank: 88 },
  { symbol: "ARB", name: "Arbitrum", priceKrw: 561, priceUsd: 0.41, change24h: -8.3, rank: 64 },
  { symbol: "OP", name: "Optimism", priceKrw: 1615, priceUsd: 1.18, change24h: -7.1, rank: 70 },
  { symbol: "AVAX", name: "Avalanche", priceKrw: 26580, priceUsd: 19.4, change24h: -5.6, rank: 18 },
];
const FALLBACK: MoversData = { gainers: MOCK_GAINERS, losers: MOCK_LOSERS, fetchedAt: 0 };

type MarketRow = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap_rank: number | null;
};

async function fetchTop(vs: "krw" | "usd"): Promise<MarketRow[]> {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs}&order=market_cap_desc&per_page=250&page=1&price_change_percentage=24h&sparkline=false`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`coingecko ${vs} ${res.status}`);
  return (await res.json()) as MarketRow[];
}

export async function fetchMovers(): Promise<MoversData> {
  try {
    const [krw, usd] = await Promise.all([fetchTop("krw"), fetchTop("usd")]);
    const usdMap = new Map(usd.map((r) => [r.id, r]));

    const merged: Coin[] = krw
      .filter((r) => {
        if (!r.market_cap_rank || r.market_cap_rank > TOP_RANK) return false;
        if (STABLES.has(r.symbol.toLowerCase())) return false;
        if (r.price_change_percentage_24h == null) return false;
        return true;
      })
      .map((r) => ({
        symbol: r.symbol.toUpperCase(),
        name: r.name,
        priceKrw: r.current_price,
        priceUsd: usdMap.get(r.id)?.current_price ?? 0,
        change24h: r.price_change_percentage_24h ?? 0,
        rank: r.market_cap_rank ?? 999,
      }));

    const sorted = [...merged].sort((a, b) => b.change24h - a.change24h);
    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse(),
      fetchedAt: Date.now(),
    };
  } catch {
    return FALLBACK;
  }
}
