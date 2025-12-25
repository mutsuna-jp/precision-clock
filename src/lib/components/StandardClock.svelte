<script lang="ts">
  let { now, timeZoneName } = $props();

  let h = $derived(now.getHours().toString().padStart(2, "0"));
  let m = $derived(now.getMinutes().toString().padStart(2, "0"));
  let s = $derived(now.getSeconds().toString().padStart(2, "0"));
  let ms = $derived(now.getMilliseconds().toString().padStart(3, "0"));
</script>

<div class="display">
  <span class="time">{h}:{m}:{s}</span>
  <span class="ms">.{ms}</span>
</div>
<div class="timezone-info">
  TIMEZONE: {timeZoneName}
</div>

<style>
  .display {
    font-variant-numeric: tabular-nums;
    margin: 1rem 0;
    text-align: center;
  }

  .time {
    font-size: 4rem;
    font-weight: 700;
    color: #e0e0e0;
  }

  .ms {
    font-size: 2rem;
    color: #ff3e00;
  }

  .timezone-info {
    font-size: 0.7rem;
    color: #444;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
    letter-spacing: 0.1rem;
    text-align: center;
  }
</style>
