<script lang="ts">
export default {
  name: 'LoadingSpinner',
};
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <ProgressSpinner style="width: 80px; height: 80px" strokeWidth="4" fill="var(--surface-ground)"
                     animationDuration=".5s" aria-label="Custom ProgressSpinner" />
  </div>
</template>