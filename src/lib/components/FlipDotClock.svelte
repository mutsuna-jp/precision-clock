<script lang="ts">
  import FlipDotDigit from "./FlipDotDigit.svelte";

  let { now } = $props();

  function split(num: number) {
    return num.toString().padStart(2, "0").split("");
  }

  let hDigits = $derived(split(now.getHours()));
  let mDigits = $derived(split(now.getMinutes()));
  let sDigits = $derived(split(now.getSeconds()));
</script>

<div class="flip-dot-clock-container">
  <div class="group">
    <FlipDotDigit value={hDigits[0]} />
    <FlipDotDigit value={hDigits[1]} />
  </div>
  <!-- Colon: Just use a generic separator or a special specific dot pattern? 
       Usually colons are also dots. Let's use FlipDotDigit with ":" value if supported, 
       or just a visual spacer. -->
  <div class="colon">
    <div class="dot active"></div>
    <div class="dot active"></div>
  </div>
  <div class="group">
    <FlipDotDigit value={mDigits[0]} />
    <FlipDotDigit value={mDigits[1]} />
  </div>
  <div class="colon">
    <div class="dot active"></div>
    <div class="dot active"></div>
  </div>
  <div class="group">
    <FlipDotDigit value={sDigits[0]} />
    <FlipDotDigit value={sDigits[1]} />
  </div>
</div>

<style>
  .flip-dot-clock-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px;
    background: #252525;
    border-radius: 10px;
    box-shadow: inset 0 0 10px #000;
  }

  .group {
    display: flex;
    gap: 4px;
    background: #000;
    padding: 4px;
    border-radius: 4px;
  }

  .colon {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    padding: 0 4px;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #1a1a1a;
    border-radius: 50%;
  }

  .dot.active {
    background: #ccff00;
    box-shadow: 0 0 5px #ccff00;
  }
</style>
