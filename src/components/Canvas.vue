<script setup lang="ts">
import {onMounted, ref} from "vue";
import {setupCanvas} from "@/render/gl";
import "@/assets/fullscreen.css";

const canvas = ref(null as null | HTMLCanvasElement);

// lifecycle hooks
onMounted(() => {
  if (!canvas.value) {
    console.error("Canvas could not be found.");
  } else {
    setupCanvas(canvas.value);
  }
});
</script>

<template>
  <canvas ref="canvas" class="main-canvas"></canvas>
</template>

<style scoped>

.main-canvas {
  width: 100%;
  height: 100%;
}
</style>
