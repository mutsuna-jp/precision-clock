<script lang="ts">
  let { value } = $props();

  // ニキシー管の一般的な積層順序（手前から奥へ）の例: 1, 7, 2, 6, 5, 0, 4, 9, 8, 3
  // これにより、数字が切り替わるときに「手前で光った」「奥で光った」という奥行き感が生まれます。
  const stackOrder = [1, 7, 2, 6, 5, 0, 4, 9, 8, 3];
</script>

<div class="nixie-tube">
  <div class="tube-glass">
    <div class="mesh-overlay"></div>
    <div class="filaments">
      {#each stackOrder as num, index}
        <span
          class="filament"
          class:active={num.toString() === value.toString()}
          style="--z-index: {stackOrder.length - index}; --scale-factor: {1 -
            index * 0.02};"
        >
          {num}
        </span>
      {/each}
    </div>
    <div class="glass-reflection-left"></div>
    <div class="glass-reflection-right"></div>
    <div class="glow-bloom"></div>
  </div>
  <div class="base"></div>
</div>

<style>
  .nixie-tube {
    position: relative;
    width: 44px;
    height: 90px;
    /* 暗い背景に馴染むガラス色 */
    background: radial-gradient(
      circle at 30% 30%,
      rgba(40, 30, 30, 0.4),
      rgba(10, 5, 5, 0.8)
    );
    border-radius: 20px 20px 8px 8px;
    /* ガラスの厚みと立体感 */
    box-shadow:
      inset -2px -2px 6px rgba(0, 0, 0, 0.8),
      inset 2px 2px 6px rgba(255, 255, 255, 0.1),
      0 0 10px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    margin: 0 4px;
    overflow: hidden;
    border: 1px solid rgba(100, 60, 50, 0.3);
    /* 全体的にほんのりオレンジがかった色味 */
    filter: sepia(0.2);
  }

  .tube-glass {
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  /* メッシュアノード（網）の表現: 微細なドットパターンなどを重ねてアナログ感を出す */
  .mesh-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0, 0, 0, 0.3) 1px, transparent 1px);
    background-size: 3px 3px;
    opacity: 0.3;
    z-index: 5;
    pointer-events: none;
  }

  .filaments {
    position: absolute;
    inset: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 100px; /* 立体感を強調 */
  }

  .filament {
    position: absolute;
    font-family: "Roboto Mono", "Courier New", monospace; /* 少し無機質なフォントが合う */
    font-size: 3.2rem;
    line-height: 1;
    width: 100%;
    text-align: center;

    /* 非点灯時のスタイル: 鈍い金属色で薄っすら見える */
    color: rgba(60, 40, 30, 0.1);
    opacity: 0.2; /* ベースの透明度 */

    /* 積層構造の適用 */
    z-index: var(--z-index);

    /* Center exactly - visually adjusted */
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%) scale(var(--scale-factor));

    /* 消えるとき（Active -> Inactive）: 
       残光を残すために時間をかける。
       これにより、新しい数字が光り始めても前の数字がしばらく残るため、重なり（奥行き）を感じられる。 
    */
    transition:
      opacity 0.35s ease-out,
      color 0.35s ease-out,
      text-shadow 0.35s ease-out;

    will-change: opacity, color, text-shadow;
  }

  /* 点灯時のスタイル: 強烈なオレンジ発光と多重拡散 */
  .filament.active {
    color: #ffdcb4; /* 中心核は白に近いオレンジ */
    /* z-indexは物理順序維持 */

    text-shadow:
      0 0 4px #fff,
      /* 中心輝度 */ 0 0 8px #ff7b00,
      /* 内側の強い発光 */ 0 0 15px #ff5500,
      /* 外側の発光 */ 0 0 30px #ff3300,
      /* ガス拡散 */ 0 0 50px #ff0000; /* 環境光 */

    opacity: 1;

    /* 光るとき（Inactive -> Active）:
       ガスは電圧印加で比較的素早く発光する。
       ただしLEDほど瞬時ではない「ふわっ」とした立ち上がり（0.08s程度）にする。
    */
    transition:
      opacity 0.08s ease-out,
      color 0.08s ease-out,
      text-shadow 0.08s ease-out;
  }

  /* ガラスの反射（左側ハイライト） */
  .glass-reflection-left {
    position: absolute;
    top: 5%;
    left: 8%;
    width: 8%;
    height: 85%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 40%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 4px;
    z-index: 30;
    pointer-events: none;
    filter: blur(1px);
  }

  /* ガラスの反射（右側リムライト） */
  .glass-reflection-right {
    position: absolute;
    top: 10%;
    right: 5%;
    width: 4%;
    height: 80%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    border-radius: 4px;
    z-index: 30;
    pointer-events: none;
    filter: blur(1px);
  }

  /* 全体の発光感（Bloom） */
  .glow-bloom {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle,
      rgba(255, 100, 0, 0.1) 0%,
      transparent 70%
    );
    z-index: 25;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .base {
    width: 100%;
    height: 12px;
    background: linear-gradient(to right, #1a1a1a, #333, #1a1a1a);
    border-top: 1px solid #444;
    border-radius: 0 0 6px 6px;
    position: relative;
    z-index: 40;
  }
</style>
