<script lang="ts">
  import MorphDigit from "./MorphDigit.svelte";

  let { now } = $props();

  function split(num: number) {
    return num.toString().padStart(2, "0").split("");
  }

  let hDigits = $derived(split(now.getHours()));
  let mDigits = $derived(split(now.getMinutes()));
  let sDigits = $derived(split(now.getSeconds()));

  // Blink every second: 0-500ms = shown, 500-1000ms = hidden (morphed to center/off)
  let colonState = $derived(now.getMilliseconds() < 500 ? ":" : "off");
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

  <MorphDigit
    value={colonState}
    color="rgba(255, 255, 255, 0.5)"
    width="40px"
    viewBox="30 0 40 130"
  />

  <div class="group">
    <MorphDigit value={mDigits[0]} color="#00f2fe" />
    <MorphDigit value={mDigits[1]} color="#00f2fe" />
  </div>

  <MorphDigit
    value={colonState}
    color="rgba(255, 255, 255, 0.5)"
    width="40px"
    viewBox="30 0 40 130"
  />

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
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .group {
    display: flex;
    gap: 5px;
  }
</style>
