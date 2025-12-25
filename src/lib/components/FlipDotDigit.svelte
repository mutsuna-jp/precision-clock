<script lang="ts">
  import { onMount } from "svelte";

  let { value }: { value: string } = $props();

  // 5x7 Dot Matrix Font
  const font: Record<string, number[][]> = {
    "0": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    "1": [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ],
    "2": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    "3": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    "4": [
      [0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
    ],
    "5": [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    "6": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    "7": [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ],
    "8": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    "9": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0],
      [0, 1, 1, 1, 0],
    ],
    ":": [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    " ": [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  };

  let grid = $state<number[][]>(
    Array(7)
      .fill(0)
      .map(() => Array(5).fill(0)),
  );

  // Sound synthesis context
  let audioCtx: AudioContext | null = null;

  onMount(() => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("AudioContext not supported");
    }

    // Random noise loop (idle fluttering)
    // Simulates mechanical "breath" or glitches
    let noiseTimer: ReturnType<typeof setTimeout>;

    function scheduleNoise() {
      // Random interval: 5 to 20 seconds per digit
      const interval = 5000 + Math.random() * 15000;

      noiseTimer = setTimeout(() => {
        // Pick a random dot
        const r = Math.floor(Math.random() * 7);
        const c = Math.floor(Math.random() * 5);

        // Trigger a flutter on this dot
        triggerFlutter(r, c);

        // Schedule next
        scheduleNoise();
      }, interval);
    }

    scheduleNoise();

    return () => {
      clearTimeout(noiseTimer);
    };
  });

  function playFlipSound() {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // Simple noise burst / click
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Filter to make it sound more like a plastic mechanical click
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800 + Math.random() * 400; // Varying pitch
    filter.Q.value = 1;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    // Short click
    osc.type = "square";
    osc.frequency.value = 100 + Math.random() * 50;

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  $effect(() => {
    // Clone the font pattern so we can mutate grid independently (for flutter)
    // font is static, so we can access it directly.
    const patternRef = font[value] || font["0"];
    const newGrid = patternRef.map((row) => [...row]); // Deep clone

    // Detect changes
    const changes: { r: number; c: number }[] = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c] !== newGrid[r][c]) {
          changes.push({ r, c });
        }
      }
    }

    if (changes.length > 0) {
      playFlipSound();
      setTimeout(playFlipSound, 30); // Echo

      // Update main grid immediately
      grid = newGrid;

      // Trigger flutters (mechanical bounce/chatter)
      changes.forEach(({ r, c }) => {
        // 10% chance to flutter
        if (Math.random() < 0.1) {
          triggerFlutter(r, c);
        }
      });
    }
  });

  function triggerFlutter(r: number, c: number) {
    // Wait for the main flip (approx 200-300ms)
    // Then flip to "wrong" state briefly, then back to "correct" state
    const delay = 250 + Math.random() * 150;

    setTimeout(() => {
      // Determine what the dot SHOULD be right now (in case it changed again)
      const currentPattern = font[value] || font["0"];
      const targetVal = currentPattern[r][c];
      const inverseVal = targetVal === 1 ? 0 : 1;

      // 1. Flip to inverse (bounce)
      grid[r][c] = inverseVal;
      // Play a small extra click sound for flutter? Maybe too noisy.

      setTimeout(() => {
        // 2. Flip back to target
        const currentPattern2 = font[value] || font["0"];
        grid[r][c] = currentPattern2[r][c];

        // 3. Occasionally (30%) do one more bounce
        if (Math.random() < 0.3) {
          setTimeout(() => {
            const currentPattern3 = font[value] || font["0"];
            const targetVal3 = currentPattern3[r][c];
            const inverseVal3 = targetVal3 === 1 ? 0 : 1;

            grid[r][c] = inverseVal3;

            setTimeout(() => {
              grid[r][c] = targetVal3;
            }, 120);
          }, 120);
        }
      }, 150); // Duration of the "wrong" state
    }, delay);
  }
</script>

<div class="matrix">
  {#each grid as row, r}
    {#each row as cell, c}
      <div class="dot-container">
        <!-- 
            Use a random delay for the transition to create the "para-para" effect.
            We can regenerate this key on update or just use a fixed random seed per dot.
            Since updates happen via 'cell' value changing ($state), 
            we can rely on CSS transition.
         -->
        <div
          class="dot"
          class:active={cell === 1}
          style="transition-delay: {Math.random() * 150}ms"
        >
          <div class="side front"></div>
          <div class="side back"></div>
        </div>
      </div>
    {/each}
  {/each}
</div>

<style>
  .matrix {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(7, 1fr);
    gap: 2px;
    /* Removed background/padding to blend into parent */
  }

  .dot-container {
    width: 12px;
    height: 12px;
    perspective: 100px; /* Perspective for 3D flip */
  }

  /* 
    The Dot
    It rotates 180 degrees.
  */
  .dot {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.3s cubic-bezier(0.4, 2.5, 0.6, 1); /* Bouncy/Snap effect */
    border-radius: 50%;
  }

  .dot.active {
    transform: rotateY(180deg);
  }

  .side {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 50%;
    /* Inset shadow to make it look like a physical disk in a hole */
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
  }

  /* 
    Back side is the "OFF" state (default visible when 0 deg). 
    Wait, logic: 
    If active (1), we rotate 180deg.
    So the side visible at 180deg should be the "ON" color.
    The side visible at 0deg should be the "OFF" color.
    
    At 0deg, 'front' is visible? No, usually:
    Side 1 (Front): 0deg.
    Side 2 (Back): 180deg (rotated).
    
    If 'backface-visibility: hidden', then:
    0deg: Front is visible.
    180deg: Back is visible.
    
    So OFF state = 0deg = Front face = Black.
    ON state = 180deg = Back face = Fluorescent.
  */

  .front {
    background-color: #1a1a1a; /* Dark gray/black for OFF */
    transform: rotateY(0deg);
  }

  .back {
    background-color: #ccff00; /* Fluorescent Yellow-Green for ON */
    transform: rotateY(180deg);
    /* Add a little gloss/texture if possible */
    background-image: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0) 10%
    );
  }
</style>
