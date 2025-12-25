<script lang="ts">
  import FlipCard from "./FlipCard.svelte";

  let { now } = $props();

  function split(num: number) {
    return num.toString().padStart(2, "0").split("");
  }

  let hDigits = $derived(split(now.getHours()));
  let mDigits = $derived(split(now.getMinutes()));
  let sDigits = $derived(split(now.getSeconds()));
</script>

<div class="flip-clock-container">
  <div class="group">
    <FlipCard value={hDigits[0]} />
    <FlipCard value={hDigits[1]} />
  </div>
  <div class="colon">:</div>
  <div class="group">
    <FlipCard value={mDigits[0]} />
    <FlipCard value={mDigits[1]} />
  </div>
  <div class="colon">:</div>
  <div class="group">
    <FlipCard value={sDigits[0]} />
    <FlipCard value={sDigits[1]} />
  </div>
</div>

<style>
  .flip-clock-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    /* background: #000; */
    border-radius: 10px;
  }

  .group {
    display: flex;
    gap: 4px;
  }

  .colon {
    font-size: 40px;
    font-weight: bold;
    color: #444;
    margin: 0 2px;
    padding-bottom: 10px; /* Align visually with center */
    /* No blink for flip clock usually, or optional. Let's keep it steady for industrial look */
  }
</style>
