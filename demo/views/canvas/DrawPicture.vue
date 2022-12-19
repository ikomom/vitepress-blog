<template>
  <div>
    <button @click="draw.animateGo()" class="btn">重放</button>
    <button @click="draw.clear()" class="btn">清空</button>
    <button @click="drawSmile()" class="btn">笑脸</button>
    <br/>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script setup>
import {Draw} from "./Draw";
import {onMounted, ref} from "vue";

const draw = new Draw()
const canvas = ref()

const drawSmile = () => {
  const c = draw.canvas

  c.beginPath()
  const cx = 150
  const cy = 150
  const radius = 70
  c.arc(cx, cy, radius, 0, Math.PI * 2, true)

  // 左眼
  const lr = 10, lcx = cx - 25 + lr, lcy = cx - 25
  c.moveTo(lcx, lcy)
  c.arc(lcx - lr, lcy, lr, 0, Math.PI * 2, true)
  // 右眼
  const rr = 10, rcx = cx + 25 + rr, rcy = cx - 25
  c.moveTo(rcx, rcy)
  c.arc(rcx - rr, rcy, rr, 0, Math.PI * 2, true)
  // 嘴
  const sr = 32, scx = cx + sr, scy = cy + 20
  c.moveTo(scx, scy)
  c.arc(scx - sr, scy, sr, 0, Math.PI, false)
  c.closePath()
  // c.globalAlpha = 0.2

  c.stroke()
  //
  // const path = new Path2D('M200 250 C167.39999389648438 179.79998779296875 494.3999938964844 122.79998779296875 500,250')
  // c.stroke(path)
}

onMounted(() => {
  draw.init(canvas.value, 600, 500)

  function drawW() {
    var ctx = draw.canvas;
    ctx.beginPath()
    ctx.scale(2.5, 2.5)
    ctx.lineTo(10, 100)
    ctx.lineTo(1, 130)
    // ctx.moveTo(10, 100)
    ctx.lineTo(-1, 200)
    ctx.miterLimit = 1
    ctx.lineJoin= 'miter'
    // ctx.fillStyle='red'
    ctx.closePath()
    // ctx.fill()
    ctx.stroke()
  }
  drawW()

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
