<script lang="ts" setup>
import { ref, watchEffect, watch } from 'vue'
import { promotion } from './sound'
import { addLog, score, title, life } from './state'

let maxScore = ref(0)
let displayScore = ref(0)
let displayMaxScore = ref(0)

watchEffect(() => {
  maxScore.value = Math.max(score.value, maxScore.value)
})

const DURATION = 1000
let scoreUpdate = 0
let maxUpdate = 0
function updateDisplay() {
  let set = false
  if (displayScore.value !== score.value) {
    displayScore.value = Math.min(displayScore.value + scoreUpdate, score.value)
    set = true
  }
  if (maxScore.value !== displayMaxScore.value) {
    displayMaxScore.value = Math.min(displayMaxScore.value + maxUpdate, maxScore.value)
    set = true
  }
  if (set) {
    requestAnimationFrame(updateDisplay)
  }
}
watch(() => score.value, () => {
  if (score.value === 0) {
    displayScore.value = 0
  }
  scoreUpdate = Math.max(Math.floor((score.value - displayScore.value) * 16 / DURATION), 1)
  maxUpdate = Math.max(Math.floor((maxScore.value - displayMaxScore.value) * 16 / DURATION), 1)
  requestAnimationFrame(updateDisplay)
})

let showPromotion = ref(false)
watch(() => title.value[1], (to, from) => {
  if (to !== 'JavaScript Learner') {
    showPromotion.value = true
  }
  addLog({
    type: 'Promotion',
    from, to
  })
  promotion()
  setTimeout(() => showPromotion.value = false, 800)
})

let showDecrease = ref(false)
watch(() => life.value, (to, from) => {
  console.log(to, from)
  if (from > to) {
    showDecrease.value = true
  }
  setTimeout(() => showDecrease.value = false, 400)
})
</script>

<template>
  <div class="card">
    <div class="js-title">
      <em :title="title[2]">
        {{title[1]}} {{life}}
        <transition>
          <span class="up" v-if="showPromotion">↑</span>
        </transition>
        <transition>
          <span class="down" v-if="showDecrease">-1</span>
        </transition>
      </em>
    </div>
    <br/>
    <div class="row">
      <p>Current Score: {{displayScore}}</p>
      <p>Historical High: {{displayMaxScore}}</p>
    </div>
  </div>
</template>
<style scoped>
.row > p {
  flex: 1 0 40%;
  margin: 0;
  text-align: center;
  font-family: monospace;
}
.js-title {
  text-align: center;
  font-size: 1.2em;
}
.up {
  margin-left: 0.5em;
  transition: all 0.5s ease;
  position: absolute;
  font-weight: bold;
  font-size: 1.2em;
  color: #00c805;
}
.down {
  transition: all 0.2s ease;
  position: absolute;
  font-weight: bold;
  color: #ff5000;
}
.v-enter-from {
  transform: translateY(25%);
}
.v-leave-to {
  transform: translateY(-25%);
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
