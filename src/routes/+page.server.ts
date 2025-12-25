import type { PageServerLoad } from "./$types";

// Vercel Edge Functionsで動作させる設定（重要）
export const config = {
  runtime: "edge",
};

export const load: PageServerLoad = async () => {
  // Date.now() はUTCのミリ秒を返す
  return {
    serverTime: Date.now(),
  };
};
