<script lang="ts">
  import { run } from "svelte/legacy";

  let { value = 0, max = 9, duration = 300 } = $props();

  let isAnimating = $state(false);
  // Initialize offsetIndex with current value.
  // Updates will be handled by the effect below.
  let offsetIndex = $state(value);
  let transitionEnabled = $state(true);

  // Store timeout ID to clear on new updates
  let resetTimeout: ReturnType<typeof setTimeout> | null = null;
  let moveTimeout: ReturnType<typeof setTimeout> | null = null;

  // Generate the strip: 0, 1, ..., max, 0
  let strip = $derived([...Array(max + 1).keys(), 0]);

  // Track previous value to detect wrap-around
  let previousValue = value;

  run(() => {
    if (value !== previousValue) {
      updateValue(value, previousValue);
      previousValue = value;
    }
  });

  function updateValue(current: number, prev: number) {
    if (resetTimeout) {
      clearTimeout(resetTimeout);
      resetTimeout = null;
    }
    if (moveTimeout) {
      clearTimeout(moveTimeout);
      moveTimeout = null;
    }

    const isWrappingForward = prev === max && current === 0;

    // Logic to handle "Visual Snap" if we were at the wrap point
    if (offsetIndex === max + 1) {
      // We were floating at the duplicate '0' at the bottom.
      // 1. Snap instantly to the real '0' at the top.
      transitionEnabled = false;
      offsetIndex = 0;

      // 2. Schedule the move to the new 'current' value.
      // If current is 0, we are already there.
      // If current is 1 (normal timeline), we want to animate 0->1.
      if (current !== 0) {
        moveTimeout = setTimeout(() => {
          transitionEnabled = true;
          offsetIndex = current;
        }, 20); // Small delay to allow DOM to register the snap
      } else {
        // Just re-enable transition for future
        moveTimeout = setTimeout(() => {
          transitionEnabled = true;
        }, 20);
      }
      return;
    }

    if (isWrappingForward) {
      // 9 -> 0 case.
      // Animate to max + 1 (duplicate 0).
      transitionEnabled = true;
      offsetIndex = max + 1;

      // Schedule silent reset to 0
      resetTimeout = setTimeout(() => {
        transitionEnabled = false;
        offsetIndex = 0;

        // Re-enable transition shortly after
        resetTimeout = setTimeout(() => {
          transitionEnabled = true;
          resetTimeout = null;
        }, 50);
      }, duration);
    } else {
      // Standard Case
      transitionEnabled = true;
      offsetIndex = current;
    }
  }
</script>

<div class="wheel-container">
  <div class="wheel-window">
    <div
      class="wheel-strip"
      style:transform={`translateY(-${(offsetIndex * 100) / strip.length}%)`}
      style:transition={transitionEnabled
        ? `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
        : "none"}
    >
      {#each strip as num, i}
        <div class="wheel-digit">
          {num}
        </div>
      {/each}
    </div>

    <!-- Overlays for 3D effect -->
    <div class="overlay-top"></div>
    <div class="overlay-bottom"></div>
    <div class="overlay-glass"></div>
  </div>
</div>

<style>
  .wheel-container {
    display: inline-flex;
    padding: 0 1px;
    font-size: 5rem;
  }

  .wheel-window {
    height: 1.1em;
    width: 0.7em;
    overflow: hidden;
    position: relative;
    /* Cylinder background with subtle gradient */
    background: linear-gradient(
      to right,
      #0a0a0a,
      #2a2a2a 20%,
      #2a2a2a 80%,
      #0a0a0a
    );
    /* Beveled edges for the ring look */
    border-left: 1px solid rgba(255, 255, 255, 0.05);
    border-right: 1px solid rgba(0, 0, 0, 0.8);
    box-shadow:
      inset 0 10px 10px rgba(0, 0, 0, 0.9),
      /* Top deep shadow */ inset 0 -10px 10px rgba(0, 0, 0, 0.9); /* Bottom deep shadow */
    perspective: 1000px;
    font-size: inherit;
    /* Rounded corners slightly to mimic mechanical drum edges if viewed head on */
    border-radius: 3px;
    margin: 0 1px; /* Gap between rings */
  }

  .wheel-strip {
    display: flex;
    flex-direction: column;
    will-change: transform;
    width: 100%;
    transform-style: preserve-3d;
  }

  .wheel-digit {
    height: 1.1em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #e0e0e0;
    font-family: "Roboto Mono", monospace;
    font-size: inherit;
    line-height: 1.1em;
    backface-visibility: hidden;
    /* Soft text shadow for engraving effect */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  }

  /* 3D Cylindrical Shading - Top Shadow */
  .overlay-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      transparent 100%
    );
    z-index: 2;
    pointer-events: none;
  }

  /* 3D Cylindrical Shading - Bottom Shadow */
  .overlay-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      transparent 100%
    );
    z-index: 2;
    pointer-events: none;
  }

  /* Specular Highlight (The "shine" on the curve) */
  .overlay-glass {
    position: absolute;
    top: 48%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.1);
    transform: translateY(-50%);
    z-index: 3;
    pointer-events: none;
    opacity: 0.6;
  }
</style>
