// Shared FX rate fetcher. Used by Kimchi premium card and the technicals
// table for KRW conversions. exchangerate.host is free, no key. Falls
// back to 1350 if unreachable so KRW columns still render.

export async function fetchUsdKrwRate(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=USD&symbols=KRW",
      { next: { revalidate: 600 } },
    );
    if (!res.ok) throw new Error("rate");
    const json = (await res.json()) as { rates?: { KRW?: number } };
    const krw = json.rates?.KRW;
    if (typeof krw === "number" && krw > 100) return krw;
    throw new Error("rate-shape");
  } catch {
    return 1350;
  }
}
