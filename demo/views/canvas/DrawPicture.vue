<template>
  <div>
    <button @click="draw.animateGo()" class="btn">重放</button>
    <button @click="draw.clear()" class="btn">清空</button>
    <br/>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script setup>
import {Draw} from "./Draw";
import {onMounted, ref} from "vue";
const draw = new Draw()
const canvas = ref()
onMounted(() => {
  draw.init(canvas.value, 600, 500)
})
</script>

<style scoped>
.canvas {
  border: 1px solid #ccc;
}
.btn {
  border: 1px solid #cccccc;
  margin: 0 10px;
  padding: 8px;
}
</style>
