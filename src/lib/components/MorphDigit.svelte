<script lang="ts">
  import { untrack } from "svelte";
  import { spring } from "svelte/motion";
  import { getMorphParticles } from "./morphData";

  let {
    value,
    color = "#00eaff",
    width = "100px",
    viewBox = "0 0 100 130",
  } = $props();

  // Initialize spring with the starting value
  const coords = spring(getMorphParticles(untrack(() => value)), {
    stiffness: 0.08, // Slightly faster to be noticeable
    damping: 0.4, // Less bouncy, more liquid
  });

  // Reactive effect to update spring target when value changes
  $effect(() => {
    coords.set(getMorphParticles(value));
  });
</script>

<svg {viewBox} class="digit-svg" style="width: {width};">
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
