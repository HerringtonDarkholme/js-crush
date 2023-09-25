<script lang="ts" setup>
import {ref, computed, defineProps, watchEffect} from 'vue'
const titles = [
  [0, 'JS Learner'],
  [10, 'JS Intern'],
  [25, 'Junior Eng'],
  [50, 'Senior Eng'],
  [100, 'Staff Eng'],
  [200, 'Principal Eng'],
  [500, 'JS CTO'],
  [1000, 'Douglas Crockford'],
  [3000, 'Brendan Eich'],
]
let props = defineProps({
  score: Number
})
let maxScore = ref(0)
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
    return titles[left - 1][1]
  } else {
    return titles[left][1]
  }
})
// TODO: add score effect
watchEffect(() => {
  maxScore.value = Math.max(props.score, maxScore.value)
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      Score Board
      <small class="text-muted">
        * Restart will reset current score
      </small>
    </div>
    <div class="card-body">
      <p>Current Score: {{score}}</p>
      <p>Historical High: {{maxScore}}</p>
    </div>
    <div class="card-header">
      Title: <em>{{title}}</em>
    </div>
  </div>
</template>
