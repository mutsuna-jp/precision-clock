import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ setHeaders }) => {
  setHeaders({
    "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    pragma: "no-cache",
    expires: "0",
  });

  // 外部API依存を排除し、純粋なサーバー時刻のみを返す
  return json({
    serverTime: Date.now(),
  });
};
