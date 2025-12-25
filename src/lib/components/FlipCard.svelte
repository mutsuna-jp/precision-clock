<script lang="ts">
  let { value } = $props();

  let current = $state(value);
  let previous = $state(value);
  let animating = $state(false);

  // Used to force-restart animation on rapid updates
  let animationKey = $state(0);

  $effect(() => {
    if (value !== current) {
      previous = current;
      current = value;
      animating = true;
      animationKey++;
    }
  });

  function onAnimationEnd() {
    animating = false;
    previous = current;
  }
</script>

<div class="card">
  <!-- Top Background: Helper to show the NEW value behind the flipper -->
  <div class="segment top">
    <span class="value">{current}</span>
  </div>

  <!-- Bottom Background: Shows OLD value initially, then stays there until covered -->
  <div class="segment bottom">
    <!-- If animating, we show previous (Old) so it remains visible while the leaf falls over it. -->
    <!-- Once animation ends, we show current (New). -->
    <span class="value">{animating ? previous : current}</span>
  </div>

  <!-- The Flipper Leaf -->
  <!-- Keyed block ensures the element is recreated to restart CSS animation reliably -->
  {#key animationKey}
    {#if animating}
      <div class="leaf" onanimationend={onAnimationEnd}>
        <div class="face front">
          <span class="value">{previous}</span>
        </div>
        <div class="face back">
          <span class="value">{current}</span>
        </div>
      </div>
    {/if}
  {/key}

  <!-- Static middle line for aesthetics -->
  <div class="divider"></div>
</div>

<style>
  .card {
    position: relative;
    width: 60px;
    height: 90px;
    perspective: 400px;
    /* font-family: 'Courier New', monospace; */
    font-family: "Oswald", sans-serif; /* A nice condensed font if available, else standard sans */
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    background: #222;
  }

  /* Shared Segment Styles */
  .segment {
    position: absolute;
    left: 0;
    width: 100%;
    height: 50%;
    overflow: hidden;
    background-color: #333;
    color: #e0e0e0;
    display: flex;
    justify-content: center;
    backface-visibility: hidden;
  }

  .value {
    font-size: 60px;
    font-weight: bold;
    line-height: 90px; /* Line height = full card height to center text */
    width: 100%;
    text-align: center;
    display: block;
  }

  /* Top Half */
  .top {
    top: 0;
    border-radius: 6px 6px 0 0;
    align-items: flex-start; /* Ensure top alignment if needed, but line-height handles centering mostly */
  }
  .top .value {
    margin-top: 0; /* Align text for top half */
  }

  /* Bottom Half */
  .bottom {
    bottom: 0;
    border-radius: 0 0 6px 6px;
    align-items: flex-end; /* Ensure bottom alignment */
    /* fix for background appearing above top? No, z-index handles that */
  }
  .bottom .value {
    margin-top: -45px; /* Shift text up to show bottom half */
  }

  /* Flipper Leaf */
  .leaf {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%; /* Only top half initially */
    transform-origin: bottom;
    transform-style: preserve-3d;
    z-index: 10;
    animation: flip 0.6s ease-in-out forwards;
  }

  .face {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #333;
    color: #e0e0e0;
    backface-visibility: hidden;
    border-radius: 6px 6px 0 0;
  }

  /* Front face (Top of Old) */
  .front {
    z-index: 2;
    transform: rotateX(0deg);
  }
  /* Back face (Bottom of New) */
  .back {
    z-index: 1;
    transform: rotateX(-180deg);
    border-radius: 0 0 6px 6px; /* It becomes bottom half */
    background-color: #333;
  }

  .back .value {
    /* Same as .bottom */
    margin-top: -45px;
  }

  /* 
     Correction for Back Face:
     It needs to be inverted relative to the leaf?
     The leaf rotates down (-180deg).
     The Front face is visible at 0.
     The Back face is on the other side.
     
     If we structure the leaf as a single plane:
     Front is 0deg.
     Back is 180deg.
     
     When leaf rotates -180deg:
     Front goes to -180 (hidden).
     Back goes to 0 (visible).
  */

  .back {
    transform: rotateY(0deg) rotateX(180deg); /* Rendered on the back */
    /* Wait, if I rotateX(180), it's upside down? */
  }

  @keyframes flip {
    0% {
      transform: rotateX(0deg);
    }
    100% {
      transform: rotateX(-180deg);
    }
  }

  .divider {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 20;
    transform: translateY(-50%);
  }
</style>
