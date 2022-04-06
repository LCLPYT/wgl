<script setup lang="ts">
import {onMounted, ref} from "vue";
import "@/assets/fullscreen.css";
import {setupMandelbrotScene} from "@/render/scene/mandelbrot";

const canvas = ref(null as null | HTMLCanvasElement);

// lifecycle hooks
onMounted(() => {
  if (!canvas.value) {
    console.error("Canvas could not be found.");
  } else {
    setupMandelbrotScene(canvas.value);
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
