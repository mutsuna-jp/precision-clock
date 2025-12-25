import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ setHeaders }) => {
  setHeaders({
    "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    pragma: "no-cache",
    expires: "0",
  });

  try {
    // WorldTimeAPIから正確な時刻を取得 (UTC)
    const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
    if (!response.ok) throw new Error("WorldTimeAPI fetch failed");
    
    const data = await response.json();
    // datetimeプロパティから正確なミリ秒単位のUNIX時間を生成
    const serverTime = new Date(data.datetime).getTime();

    return json({
      serverTime,
      source: "WorldTimeAPI"
    });
  } catch (error) {
    console.warn("Time sync fallback to system time:", error);
    // フォールバック: システム時刻
    return json({
      serverTime: Date.now(),
      source: "SystemClock"
    });
  }
};
