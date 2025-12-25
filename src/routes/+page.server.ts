import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // Date.now() はUTCのミリ秒を返す
  return {
    serverTime: Date.now(),
  };
};
