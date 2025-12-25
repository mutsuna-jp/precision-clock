<script lang="ts">
  import { untrack } from "svelte";
  import { spring } from "svelte/motion";
  import { DIGIT_PARTICLES } from "./morphData";

  let { value, color = "#00eaff" } = $props();

  // Helper to get particles for a value (string or number) safely
  function getParticles(val: string | number) {
    const idx = parseInt(val.toString()) || 0;
    return DIGIT_PARTICLES[idx] || DIGIT_PARTICLES[0];
  }

  // Initialize spring with the starting value
  const coords = spring(getParticles(untrack(() => value)), {
    stiffness: 0.08, // Slightly faster to be noticeable
    damping: 0.4, // Less bouncy, more liquid
  });

  // Reactive effect to update spring target when value changes
  $effect(() => {
    coords.set(getParticles(value));
  });
</script>

<svg viewBox="0 0 100 130" class="digit-svg">
  <!-- Use the global filter defined in MorphClock.svelte -->
  <g filter="url(#morph-goo)" style="fill: {color}">
    {#each $coords as [x, y], i (i)}
      <circle cx={x} cy={y} r="8" />
    {/each}
  </g>
</svg>

<style>
  .digit-svg {
    width: 100px;
    height: 150px;
    overflow: visible;
  }
</style>
