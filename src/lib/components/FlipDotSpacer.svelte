<script lang="ts">
  // A simple 1x7 column of inactive dots to act as a spacer in the Flip Dot grid.
</script>

<div class="spacer-matrix">
  {#each Array(7) as _}
    <div class="dot-container">
      <div class="dot">
        <div class="side front"></div>
        <div class="side back"></div>
      </div>
    </div>
  {/each}
</div>

<style>
  .spacer-matrix {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(7, 1fr);
    gap: 2px;
    /* Blend with parent */
  }

  .dot-container {
    width: 12px;
    height: 12px;
    perspective: 100px;
  }

  .dot {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    /* Always off, no rotation needed */
    transform: rotateY(0deg);
  }

  .side {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 50%;
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
  }

  .front {
    background-color: #1a1a1a;
    transform: rotateY(0deg);
  }

  .back {
    /* Back side logic not strictly needed if always off, but kept for consistency/completeness */
    background-color: #ccff00;
    transform: rotateY(180deg);
  }
</style>
