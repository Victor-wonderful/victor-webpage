// CoinGecko /simple/price — lightweight current-price fetcher.
// Used by the trading dashboard hero price strip.

export type SimplePrice = {
  id: string;
  symbol: string;
  name: string;
  usd: number;
  krw: number;
  change24h: number;
};

const COIN_META: Record<string, { symbol: string; name: string }> = {
  bitcoin: { symbol: "BTC", name: "Bitcoin" },
  ethereum: { symbol: "ETH", name: "Ethereum" },
  solana: { symbol: "SOL", name: "Solana" },
};

type Raw = Record<
  string,
  { usd?: number; krw?: number; usd_24h_change?: number }
>;

export async function fetchSimplePrices(
  ids: string[] = ["bitcoin", "ethereum", "solana"],
): Promise<SimplePrice[]> {
  const url = new URL("https://api.coingecko.com/api/v3/simple/price");
  url.searchParams.set("ids", ids.join(","));
  url.searchParams.set("vs_currencies", "usd,krw");
  url.searchParams.set("include_24hr_change", "true");

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`coingecko ${res.status}`);
    const json = (await res.json()) as Raw;
    return ids.map((id) => {
      const row = json[id] ?? {};
      const meta = COIN_META[id] ?? { symbol: id.toUpperCase(), name: id };
      return {
        id,
        symbol: meta.symbol,
        name: meta.name,
        usd: row.usd ?? 0,
        krw: row.krw ?? 0,
        change24h: row.usd_24h_change ?? 0,
      };
    });
  } catch {
    return ids.map((id) => {
      const meta = COIN_META[id] ?? { symbol: id.toUpperCase(), name: id };
      return { id, symbol: meta.symbol, name: meta.name, usd: 0, krw: 0, change24h: 0 };
    });
  }
}
