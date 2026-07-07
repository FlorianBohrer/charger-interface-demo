import { ref, onMounted } from "vue";

/**
 * Holt den aktuellen Day-Ahead-Börsenstrompreis (aWATTar, kostenlos, kein Key).
 * marketprice kommt in EUR/MWh -> /1000 = EUR/kWh.
 *
 * TODO: perspektivisch ins Crow-Backend verlagern (dort cachen + per WebSocket
 * ans HMI schieben), damit das Frontend nicht direkt gegen die externe API geht.
 * Fallback greift, wenn die API nicht erreichbar ist oder CORS blockt.
 */
const FALLBACK_EUR_PER_KWH = 0.59;

interface AwattarSlot {
  start_timestamp: number; // ms epoch
  end_timestamp: number;
  marketprice: number; // EUR/MWh
  unit: string;
}

export function useTariff() {
  const pricePerKwh = ref(FALLBACK_EUR_PER_KWH);
  const loading = ref(true);
  const isLive = ref(false); // true = echter Börsenpreis, false = Fallback

  onMounted(async () => {
    try {
      const res = await fetch("https://api.awattar.de/v1/marketdata");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = (await res.json()) as { data: AwattarSlot[] };
      const now = Date.now();

      // den Slot picken, in dem "jetzt" liegt (sonst den ersten)
      const slot =
        json.data.find((s) => now >= s.start_timestamp && now < s.end_timestamp) ??
        json.data[0];

      if (slot) {
        // Börsenpreis kann theoretisch negativ sein -> auf >= 0 klemmen
        pricePerKwh.value = Math.max(0, slot.marketprice / 1000);
        isLive.value = true;
      }
    } catch {
      pricePerKwh.value = FALLBACK_EUR_PER_KWH;
      isLive.value = false;
    } finally {
      loading.value = false;
    }
  });

  return { pricePerKwh, loading, isLive };
}
