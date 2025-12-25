<script lang="ts">
  import { onMount } from "svelte";
  import FlipDotDigit from "./FlipDotDigit.svelte";

  let { now } = $props();

  function split(num: number) {
    return num.toString().padStart(2, "0").split("");
  }

  let hDigits = $derived(split(now.getHours()));
  let mDigits = $derived(split(now.getMinutes()));
  let sDigits = $derived(split(now.getSeconds()));

  let colonValue = $state(":");

  onMount(() => {
    let timer: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      // Random interval between 2000ms and 8000ms
      const delay = 2000 + Math.random() * 6000;
      timer = setTimeout(() => {
        colonValue = " ";
        // Blink duration 150ms
        setTimeout(() => {
          colonValue = ":";
          scheduleNext();
        }, 150);
      }, delay);
    }

    scheduleNext();

    return () => {
      clearTimeout(timer);
    };
  });
</script>

<div class="flip-dot-clock-container">
  <div class="group">
    <FlipDotDigit value={hDigits[0]} />
    <FlipDotDigit value={hDigits[1]} />
  </div>
  <FlipDotDigit value={colonValue} />
  <div class="group">
    <FlipDotDigit value={mDigits[0]} />
    <FlipDotDigit value={mDigits[1]} />
  </div>
  <FlipDotDigit value={colonValue} />
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
    gap: 4px;
    padding: 12px;
    background: #111;
    border-radius: 8px;
    box-shadow:
      0 4px 15px rgba(0, 0, 0, 0.5),
      inset 0 0 20px rgba(0, 0, 0, 0.8);
    border: 4px solid #2a2a2a;
  }

  .group {
    display: flex;
    gap: 4px;
  }
</style>
