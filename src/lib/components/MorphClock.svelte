<script lang="ts">
  import MorphDigit from "./MorphDigit.svelte";

  let { now } = $props();

  function split(num: number) {
    return num.toString().padStart(2, "0").split("");
  }

  let hDigits = $derived(split(now.getHours()));
  let mDigits = $derived(split(now.getMinutes()));
  let sDigits = $derived(split(now.getSeconds()));
</script>

<div class="morph-clock-container">
  <!-- Global Filter Definition -->
  <svg width="0" height="0" style="position: absolute;">
    <defs>
      <filter id="morph-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>

  <!-- Use filter globally on container if needed, but per-digit is safer for bounds -->

  <div class="group">
    <MorphDigit value={hDigits[0]} color="#4facfe" />
    <MorphDigit value={hDigits[1]} color="#4facfe" />
  </div>

  <div class="colon">:</div>

  <div class="group">
    <MorphDigit value={mDigits[0]} color="#00f2fe" />
    <MorphDigit value={mDigits[1]} color="#00f2fe" />
  </div>

  <div class="colon">:</div>

  <div class="group">
    <MorphDigit value={sDigits[0]} color="#43e97b" />
    <MorphDigit value={sDigits[1]} color="#38f9d7" />
  </div>
</div>

<style>
  .morph-clock-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 20px;
    background: #000;
    border-radius: 20px;
    /* Glassmorphism background */
    background: rgba(20, 20, 20, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 30px rgba(0, 200, 255, 0.2);
  }

  .group {
    display: flex;
    gap: 5px;
  }

  .colon {
    font-size: 60px;
    font-weight: 100;
    color: rgba(255, 255, 255, 0.3);
    margin: 0 5px;
    padding-bottom: 20px;
    font-family: "Segoe UI", sans-serif;
  }
</style>
