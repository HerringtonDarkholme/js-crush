<script lang="ts" setup>
import { ref, computed, defineProps, watchEffect, watch } from 'vue'
import { addLog } from './logs'
// TODO: add some JD for these positions
const titles = [
  [0, 'JavaScript Learner'],
  [10, 'JavaScript Intern'],
  [25, 'Junior Engineer'],
  [50, 'Senior Engineer'],
  [100, 'Staff Engineer'],
  [200, 'Principal Engineer'],
  [500, 'JavaScript CTO'],
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
watch(() => title.value, (to, from) => {
  addLog({
    type: 'Promotion',
    from, to
  })
})
</script>

<template>
  <div class="card">
    <h3 class="card-header"> Score Board </h3>
    <div class="row">
      <p>Current Score: {{score}}</p>
      <p>Historical High: {{maxScore}}</p>
    </div>
    <h3 class="js-title-header">Title</h3>
    <div class="js-title"><em :title="title">{{title}}</em></div>
  </div>
</template>
<style scoped>
.row > p {
  flex: 1 0 40%;
  margin: 0;
  text-align: center;
}
.js-title-header {
  margin-top: 1em;
}
.js-title {
  text-align: center;
}
</style>
