<script lang="ts">
  import VFDDigit from "./VFDDigit.svelte";

  let { now } = $props();

  function split(num: number) {
    return num.toString().padStart(2, "0").split("");
  }

  let hDigits = $derived(split(now.getHours()));
  let mDigits = $derived(split(now.getMinutes()));
  let sDigits = $derived(split(now.getSeconds()));
</script>

<div class="vfd-clock-container">
  <!-- Decorative aesthetic lines like top-screen markings -->
  <!-- <div class="decoration-line"></div> -->

  <div class="display-area">
    <div class="group">
      <VFDDigit value={hDigits[0]} />
      <VFDDigit value={hDigits[1]} />
    </div>

    <div class="separator">
      <div class="dot top"></div>
      <div class="dot bottom"></div>
    </div>

    <div class="group">
      <VFDDigit value={mDigits[0]} />
      <VFDDigit value={mDigits[1]} />
    </div>

    <div class="separator">
      <div class="dot top"></div>
      <div class="dot bottom"></div>
    </div>

    <div class="group">
      <VFDDigit value={sDigits[0]} />
      <VFDDigit value={sDigits[1]} />
    </div>
  </div>
</div>

<style>
  .vfd-clock-container {
    display: inline-block;
    padding: 20px 30px;
    background-color: #000;
    border-radius: 4px;
    box-shadow:
      0 0 0 2px #222,
      0 0 20px rgba(0, 255, 255, 0.1);
    border: 1px solid #333;
    position: relative;
    overflow: hidden;
  }

  /* Glass reflection hint */
  .vfd-clock-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    pointer-events: none;
    z-index: 20;
  }

  .display-area {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 5;
  }

  .group {
    display: flex;
    gap: 2px;
  }

  .separator {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    height: 40px;
    padding: 0 4px;
  }

  .dot {
    width: 4px;
    height: 4px;
    background-color: #00ffff;
    border-radius: 50%;
    box-shadow: 0 0 4px #00ffff;
    opacity: 0.8;
  }
</style>
