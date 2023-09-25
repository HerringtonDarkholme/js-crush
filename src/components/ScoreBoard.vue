<script lang="ts" setup>
import {ref, defineProps, watchEffect} from 'vue'
let props = defineProps({
  score: Number
})
let maxScore = ref(0)
watchEffect(() => {
  maxScore.value = Math.max(props.score, maxScore.value)
})
</script>

<template>
  <div class="card text-dark bg-transparent">
    <div class="card-header">
      Score Board
      <small class="text-muted">
        * Restart will reset current score
      </small>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-6 col-lg-12">
          <p>Current Score: {{score}}</p>
        </div>
        <div class="col-6 col-lg-12">
          <p>Historical High: {{maxScore}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
