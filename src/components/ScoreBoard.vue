<script lang="ts" setup>
import { ref, computed, watchEffect, watch } from 'vue'
import { promotion } from './sound'
import { addLog } from './logs'
const titles = [
  [0, 'JavaScript Learner', 'Know how to `console.log("hello world")`? Congrats!'],
  [100, 'JavaScript Intern', 'console.log and alert are your best friend.'],
  [250, 'Junior Engineer', 'Functions and Loops are Bread and Butter.'],
  [500, 'Senior Engineer', 'You mastered frameworks and libraries!? What about == equality?'],
  [1000, 'Staff Engineer', 'You, a leader, a mentor and a semicolon judge.'],
  [2000, 'Principal Engineer', 'Build visionary JS app and JS meme.'],
  [5000, 'JavaScript CTO', 'You are the boss of JavaScript!'],
  [10000, 'Douglas Crockford', 'You are the legend of JavaScript! The game is a tribute to JS the good part.'],
  [39262, 'TC39 Member', 'The future (rule) of this game is in your hand.'],
  [50000, 'Brendan Eich', 'My Lord, you invented the language in 10 days.'],
] as const
let props = defineProps({
  score: {
    type: Number,
    required: true,
  },
})
let maxScore = ref(0)
let displayScore = ref(0)
let displayMaxScore = ref(0)
let title = computed(() => {
  let left = 0
  let right = titles.length - 1
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2)
    if (titles[mid][0] < props.score) {
      left = mid + 1
    } else {
      right = mid
    }
  }
  if (props.score < titles[left][0]) {
    console.assert(left > 0)
    return titles[left - 1]
  } else {
    return titles[left]
  }
})
// TODO: add score effect
watchEffect(() => {
  maxScore.value = Math.max(props.score, maxScore.value)
})

const DURATION = 1000
let scoreUpdate = 0
let maxUpdate = 0
function updateDisplay() {
  if (displayScore.value !== props.score) {
    displayScore.value = Math.min(displayScore.value + scoreUpdate, props.score)
    requestAnimationFrame(updateDisplay)
  }
  if (maxScore.value !== displayMaxScore.value) {
    displayMaxScore.value = Math.min(displayMaxScore.value + maxUpdate, maxScore.value)
  }
}
watch(() => props.score, () => {
  if (props.score === 0) {
    displayScore.value = 0
  }
  scoreUpdate = Math.max(Math.floor((props.score - displayScore.value) * 16 / DURATION), 1)
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
</script>

<template>
  <div class="card">
    <div class="js-title">
      <em :title="title[2]">
        {{title[1]}}
        <transition>
          <span class="up" v-if="showPromotion">↑</span>
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
