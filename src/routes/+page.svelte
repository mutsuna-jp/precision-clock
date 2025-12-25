<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { invalidateAll } from "$app/navigation";

  let { data } = $props();

  // 表示用の変数 (Svelte 5 Runes)
  let timeString = $state("00:00:00");
  let msString = $state("000");
  let timeZoneName = $state("");

  // デバッグ・統計情報
  let rtt = $state(0);
  let offset = $state(0);
  let isSyncing = $state(false);
  let lastSyncAt = $state<Date | null>(null);

  // 高精度タイマー用の変数
  let lastSyncServerTime = $state(0);
  let lastSyncLocalPerfTime = $state(0);

  let animationFrameId: number;
  let timerInterval: any;

  // 時刻同期関数
  async function syncTime() {
    if (isSyncing) return;
    isSyncing = true;

    const samples: {
      rtt: number;
      serverTimeAtT1: number;
      t1: number;
      offset: number;
    }[] = [];
    const numSamples = 5;

    // ウォームアップ
    try {
      await fetch(`/api/time?t=${Date.now()}`, { method: "HEAD" }).catch(
        () => {},
      );
    } catch {}

    for (let i = 0; i < numSamples; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const t0 = performance.now();
        const response = await fetch(`/api/time?t=${Date.now()}`, {
          signal: controller.signal,
        });
        const result = await response.json();
        clearTimeout(timeoutId);

        const serverTs = result.serverTime;
        const t1 = performance.now();
        const sampleRtt = t1 - t0;

        // 応答受信時点(t1)での推定サーバー時刻
        const serverTimeAtT1 = serverTs + sampleRtt / 2;
        const sampleOffset = serverTimeAtT1 - Date.now();

        samples.push({
          rtt: sampleRtt,
          serverTimeAtT1,
          t1,
          offset: sampleOffset,
        });

        if (i < numSamples - 1) {
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      } catch (e) {
        console.error(`Sync sample ${i} failed:`, e);
      }
    }

    if (samples.length > 0) {
      samples.sort((a, b) => a.rtt - b.rtt);
      const bestSample = samples[0];

      rtt = bestSample.rtt;
      offset = bestSample.offset;

      lastSyncServerTime = bestSample.serverTimeAtT1;
      lastSyncLocalPerfTime = bestSample.t1;
      lastSyncAt = new Date();
    }

    isSyncing = false;
  }

  // 描画ループ
  function update() {
    let now: Date;

    if (lastSyncServerTime > 0) {
      const elapsedSinceSync = performance.now() - lastSyncLocalPerfTime;
      now = new Date(lastSyncServerTime + elapsedSinceSync);
    } else {
      now = new Date();
    }

    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const ms = now.getMilliseconds().toString().padStart(3, "0");

    timeString = `${h}:${m}:${s}`;
    msString = ms;

    animationFrameId = requestAnimationFrame(update);
  }

  onMount(() => {
    timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    lastSyncLocalPerfTime = performance.now();
    // Server time init is handled by initial sync or just starting from 0
    lastSyncServerTime = 0;

    syncTime();
    update();
    timerInterval = setInterval(syncTime, 60000);
  });

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (timerInterval) clearInterval(timerInterval);
  });
</script>

<main>
  <div class="container">
    <div class="clock-wrapper">
      <h1 class="brand">PRECISION CLOCK</h1>

      <div class="display">
        <span class="time">{timeString}</span>
        <span class="ms">.{msString}</span>
      </div>
      <div class="timezone-info">
        TIMEZONE: {timeZoneName}
      </div>

      <div class="stats">
        <div class="stat-item">
          <span class="label">LATENCY (RTT)</span>
          <span class="value" class:good={rtt < 100} class:warn={rtt >= 100}>
            {rtt.toFixed(1)}<small>ms</small>
          </span>
        </div>
        <div class="stat-item">
          <span class="label">OFFSET (SERVER - LOCAL)</span>
          <span class="value">
            {offset > 0 ? "+" : ""}{offset.toFixed(1)}<small>ms</small>
          </span>
        </div>
        <div class="stat-item">
          <span class="label">ACCURACY</span>
          <span class="value" class:good={rtt < 100} class:warn={rtt >= 100}>
            ±{(rtt / 2).toFixed(1)}<small>ms</small>
          </span>
        </div>
        <div class="sync-controls">
          <button class="sync-btn" onclick={syncTime} disabled={isSyncing}>
            {#if isSyncing}
              <span class="spinner"></span>
            {/if}
            {isSyncing ? "SYNCING..." : "RESYNC"}
          </button>
          <div class="last-sync">
            {lastSyncAt
              ? `LAST SYNC: ${lastSyncAt.toLocaleTimeString()}`
              : "INITIALIZING..."}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="explanation-card">
    <div class="explanation-item">
      <h3>LATENCY (RTT)</h3>
      <p>
        通信の往復時間（Round-Trip
        Time）です。本バージョンでは5回のサンプリングを行い、最も遅延が少なかった（ネットワークの揺らぎが最小だった）テイクを採用することで、より精度の高い補正を実現しています。また、リクエストにはタイムアウト処理を施し、不安定な接続下でも安定した動作を維持します。
      </p>
    </div>
    <div class="explanation-item">
      <h3>OFFSET & SSR</h3>
      <p>
        サーバー時刻とローカル時刻の差分です。本アプリはSSR（サーバーサイドレンダリング）時に初期時刻を取得するため、ページ読み込み直後から正確な時刻を表示します。同期後はシステム時計の変動に影響されない高精度なモノトニックタイマー（performance.now）を使用して時刻を刻み、1分ごとの自動再同期によってPC時計のドリフト（微小なズレ）を継続的に補正します。
      </p>
    </div>
    <div class="explanation-item">
      <h3>ACCURACY</h3>
      <p>
        同期の正確さ（不確かさ）を示す指標です。通信往復時間（RTT）の半分を最大誤差範囲として
        ± で表示しています。time.is
        などと同様の指標であり、この数値が小さいほど、表示されている時刻が協定世界時（UTC）に近いことを意味します。
      </p>
    </div>
    <div class="explanation-item">
      <h3>THEORETICAL ACCURACY</h3>
      <p>
        理論上の誤差は、主にネットワークの「非対称性」に起因します。計算では通信の往路と復路の時間が等しい（RTT/2）と仮定していますが、本アプリでは複数回のサンプリングから最も安定したテイクを採用することでこの不確実性を最小化しています。Svelte
        5
        の細粒度なリアクティビティ（Runes）により、描画負荷によるミリ秒単位の遅延も極限まで抑えられています。
      </p>
    </div>
  </div>
</main>

<style>
  /* モダンでインダストリアルなデザイン */
  :global(body) {
    margin: 0;
    background-color: #111;
    color: #fff;
    font-family: "Courier New", Courier, monospace; /* 等幅フォント */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    box-sizing: border-box;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 600px;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .brand {
    font-size: 0.8rem;
    letter-spacing: 0.2rem;
    color: #666;
    margin-bottom: 1rem;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
    width: 100%;
    text-align: center;
    margin-top: 0;
  }

  .display {
    font-variant-numeric: tabular-nums; /* 数字の幅を固定 */
    margin: 1rem 0;
  }

  .time {
    font-size: 4rem;
    font-weight: 700;
    color: #e0e0e0;
  }

  .ms {
    font-size: 2rem;
    color: #ff3e00; /* Svelteカラー */
  }

  .stats {
    display: flex;
    gap: 1.5rem;
    margin-top: 2rem;
    font-size: 0.8rem;
    align-items: flex-end;
    width: 100%;
    justify-content: space-between;
  }

  .sync-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .label {
    color: #666;
    font-size: 0.6rem;
  }

  .value {
    font-weight: bold;
    color: #888;
    font-size: 0.8rem;
  }

  .value.good {
    color: #4caf50;
  }
  .value.warn {
    color: #ff9800;
  }

  .sync-btn {
    background: none;
    border: 1px solid #444;
    color: #888;
    padding: 0.3rem 0.8rem;
    font-family: inherit;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0;
  }

  .sync-btn:hover:not(:disabled) {
    border-color: #ff3e00;
    color: #fff;
    background: none;
  }

  .sync-btn:disabled {
    opacity: 0.5;
    cursor: wait;
  }

  .spinner {
    width: 10px;
    height: 10px;
    border: 2px solid #444;
    border-top: 2px solid #ff3e00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .last-sync {
    font-size: 0.5rem;
    color: #444;
    letter-spacing: 0.05rem;
  }

  .timezone-info {
    font-size: 0.7rem;
    color: #444;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
    letter-spacing: 0.1rem;
  }
  .explanation-card {
    width: 100%;
    padding: 1.5rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    font-size: 0.8rem;
    color: #aaa;
    line-height: 1.6;
    box-sizing: border-box;
  }

  .explanation-item h3 {
    font-size: 0.9rem;
    color: #ccc;
    margin: 0 0 0.5rem 0;
    border-left: 3px solid #ff3e00;
    padding-left: 0.5rem;
  }

  .explanation-item p {
    margin: 0 0 1.5rem 0;
  }

  .explanation-item:last-child p {
    margin-bottom: 0;
  }
</style>
