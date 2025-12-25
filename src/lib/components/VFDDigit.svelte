<script lang="ts">
  let { value = "" } = $props();

  // 7-segment map
  // a: top, b: top-right, c: bottom-right, d: bottom, e: bottom-left, f: top-left, g: middle
  const segmentsMap: Record<string, string[]> = {
    "0": ["a", "b", "c", "d", "e", "f"],
    "1": ["b", "c"],
    "2": ["a", "b", "d", "e", "g"],
    "3": ["a", "b", "c", "d", "g"],
    "4": ["b", "c", "f", "g"],
    "5": ["a", "c", "d", "f", "g"],
    "6": ["a", "c", "d", "e", "f", "g"],
    "7": ["a", "b", "c"],
    "8": ["a", "b", "c", "d", "e", "f", "g"],
    "9": ["a", "b", "c", "d", "f", "g"],
  };

  let activeSegments = $derived(segmentsMap[value] || []);
</script>

<div class="vfd-digit">
  <div class="grid-overlay"></div>

  <!-- Back (ghost) layer - all segments visible but dim -->
  <div class="segments-layer ghost">
    {#each ["a", "b", "c", "d", "e", "f", "g"] as seg}
      <div class="segment {seg}"></div>
    {/each}
  </div>

  <!-- Front (active) layer - only active segments, bright -->
  <div class="segments-layer active">
    {#each activeSegments as seg}
      <div class="segment {seg}"></div>
    {/each}
  </div>
</div>

<style>
  .vfd-digit {
    position: relative;
    width: 40px;
    height: 70px;
    background-color: #050505;
    /* Simulate the glass/vacuum tube container slightly if needed, but the clock container will do that mostly */
    overflow: hidden;
    border-radius: 4px;
  }

  /* Grid Mesh Overlay */
  .grid-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    background-image: linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px);
    background-size: 3px 3px;
    pointer-events: none;
    opacity: 0.6;
  }

  .segments-layer {
    position: absolute;
    inset: 0;
    padding: 6px;
    box-sizing: border-box;
  }

  .segment {
    position: absolute;
    background-color: currentColor;
    border-radius: 2px;
    /* Polygonal shape via clip-path for more realism if needed, but bars are okay for now */
  }

  /* Segment Positions */
  /* Vertical segments */
  .segment.b,
  .segment.c,
  .segment.e,
  .segment.f {
    width: 4px;
    height: 22px;
  }
  /* Horizontal segments */
  .segment.a,
  .segment.d,
  .segment.g {
    height: 4px;
    width: 20px;
    left: 10px; /* (40 - 20) / 2 */
  }

  .segment.a {
    top: 6px;
  }
  .segment.d {
    bottom: 6px;
  }
  .segment.g {
    top: 33px;
  } /* (70 - 4)/2 roughly */

  .segment.f {
    top: 8px;
    left: 4px;
  }
  .segment.b {
    top: 8px;
    right: 4px;
  }
  .segment.e {
    bottom: 8px;
    left: 4px;
  }
  .segment.c {
    bottom: 8px;
    right: 4px;
  }

  /* Colors */
  .ghost {
    color: #1a2a2a; /* Very dim cyan/grey */
    z-index: 1;
  }

  .active {
    color: #00ffff; /* Cyan */
    z-index: 2;
    filter: drop-shadow(0 0 2px #00ffff)
      drop-shadow(0 0 5px rgba(0, 255, 255, 0.6));
  }
</style>
