<script lang="ts">
  import WheelDigit from "./WheelDigit.svelte";

  let { now } = $props();

  let h = $derived(now.getHours());
  let m = $derived(now.getMinutes());
  let s = $derived(now.getSeconds());
  let ms = $derived(now.getMilliseconds());

  let h1 = $derived(Math.floor(h / 10));
  let h2 = $derived(h % 10);

  let m1 = $derived(Math.floor(m / 10));
  let m2 = $derived(m % 10);

  let s1 = $derived(Math.floor(s / 10));
  let s2 = $derived(s % 10);

  let ms1 = $derived(Math.floor(ms / 100));
  let ms2 = $derived(Math.floor((ms % 100) / 10));
  let ms3 = $derived(ms % 10);
</script>

<div class="wheel-clock-frame">
  <div class="axis-container">
    <div class="glass-overlay"></div>

    <!-- Hours -->
    <WheelDigit value={h1} max={2} />
    <WheelDigit value={h2} max={9} />

    <!-- Separator -->
    <div class="wheel-separator">:</div>

    <!-- Minutes -->
    <WheelDigit value={m1} max={5} />
    <WheelDigit value={m2} max={9} />

    <!-- Separator -->
    <div class="wheel-separator">:</div>

    <!-- Seconds -->
    <WheelDigit value={s1} max={5} />
    <WheelDigit value={s2} max={9} />

    <!-- Dot Separator -->
    <div class="wheel-separator dot">.</div>

    <!-- Milliseconds -->
    <div class="ms-wrapper">
      <WheelDigit value={ms1} max={9} duration={100} />
      <WheelDigit value={ms2} max={9} duration={50} />
      <WheelDigit value={ms3} max={9} duration={20} />
    </div>
  </div>
</div>

<style>
  .wheel-clock-frame {
    display: inline-block;
    padding: 10px;
    background: #1a1a1a;
    border: 4px solid #333;
    border-radius: 8px;
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.5),
      inset 0 0 30px rgba(0, 0, 0, 0.8);
  }

  /* Shared Axis Container */
  .axis-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #050505; /* Black backing */
    padding: 15px 20px;
    border-radius: 6px;
    position: relative;
    /* This font-size controls the size of all WheelDigits via em units */
    font-size: 4rem;
    gap: 0; /* Tight packing */
    overflow: hidden;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 1);
    border: 1px solid #333;
  }

  /* Unified Glass Overlay acting as a front shield */
  .glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0) 60%,
      rgba(255, 255, 255, 0.03) 100%
    );
    border-radius: 4px;
    pointer-events: none;
    z-index: 10;
    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
  }

  /* Separators rendered as fixed text floating between drums */
  .wheel-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.1em;
    width: 0.5em; /* Visible width */
    font-family: "Roboto Mono", monospace;
    font-weight: 700;
    color: #666;
    background: transparent;
    z-index: 1;
    padding-bottom: 0.1em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    position: relative;
  }

  .dot {
    width: 0.5em;
    align-items: flex-end;
    padding-bottom: 0.25em;
    color: #888;
  }

  .ms-wrapper {
    display: flex;
    align-items: center;
    /* Scale down millis */
    font-size: 0.6em;
    height: 1.1em;
    margin-left: 0.1em;
  }
</style>
