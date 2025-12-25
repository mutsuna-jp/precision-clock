<script lang="ts">
  import NixieTube from "./NixieTube.svelte";

  let { now } = $props();

  function split(num: number) {
    return num.toString().padStart(2, "0").split("");
  }

  let hDigits = $derived(split(now.getHours()));
  let mDigits = $derived(split(now.getMinutes()));
  let sDigits = $derived(split(now.getSeconds()));
</script>

<div class="nixie-clock-wrapper">
  <div class="nixie-clock-panel">
    <div class="group">
      <NixieTube value={hDigits[0]} />
      <NixieTube value={hDigits[1]} />
    </div>

    <div class="separator">
      <div class="neon-dot top"></div>
      <div class="neon-dot bottom"></div>
    </div>

    <div class="group">
      <NixieTube value={mDigits[0]} />
      <NixieTube value={mDigits[1]} />
    </div>

    <div class="separator">
      <div class="neon-dot top"></div>
      <div class="neon-dot bottom"></div>
    </div>

    <div class="group">
      <NixieTube value={sDigits[0]} />
      <NixieTube value={sDigits[1]} />
    </div>
  </div>
</div>

<style>
  .nixie-clock-wrapper {
    display: flex;
    justify-content: center;
    padding: 10px;
  }

  .nixie-clock-panel {
    display: flex;
    align-items: flex-end; /* 下揃えで配管っぽさを出す */
    justify-content: center;
    gap: 12px;
    padding: 25px 30px;

    /* ベークライトや黒染め金属のような重厚な背景 */
    background: linear-gradient(to bottom, #1a1a1c, #0e0e10);
    border: 1px solid #333;
    border-radius: 8px;

    /* 筐体の陰影 */
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(0, 0, 0, 0.8);

    position: relative;
  }

  /* パネルのネジ穴装飾などを入れたいが、シンプルに保つ */

  .group {
    display: flex;
    gap: 4px;
    /* 各桁グループを少しまとめる */
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    padding: 4px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  }

  .separator {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
    height: 60px; /* 時計の中央付近に合わせる */
    width: 20px;
    margin-bottom: 25px; /* ベースの高さ分調整 */
  }

  .neon-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ff5500;
    opacity: 0.3;
    transition: opacity 0.1s;
    box-shadow: 0 0 2px #331100;
  }

  /* 秒に合わせて点滅させてもよいが、常時点灯またはゆらぎを持たせる */
  .neon-dot {
    animation: neon-flicker 3s infinite alternate;
  }

  @keyframes neon-flicker {
    0%,
    19%,
    21%,
    23%,
    25%,
    54%,
    56%,
    100% {
      opacity: 0.8;
      box-shadow:
        0 0 4px #ff7b00,
        0 0 8px #ff5500;
      background-color: #ffaa66;
    }
    20%,
    24%,
    55% {
      opacity: 0.4;
      box-shadow: 0 0 2px #ff3300;
      background-color: #ff5500;
    }
  }
</style>
