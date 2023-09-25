<script lang="ts" setup>
import { setSeed } from './data'
import { getNowFormatDate } from './utils'
import {ref, watch, nextTick} from 'vue'
import ScoreBoard from './ScoreBoard.vue'
import { logs } from './logs'
defineProps({
  score: {
    type: Number,
    required: true,
  },
})
let emit = defineEmits<{
  startGame: [s: string]
}>()
let seedRef = ref('')

function startGame() {
  // init seed
  let seed = seedRef.value;
  if (!seed) {
    // default to timestamp
    seed = new Date().getTime().toString();
  }
  setSeed(seed);
  emit('startGame', seed)
}
// scroll logs to bottom to show latest update
watch(logs, () => {
  nextTick(() => {
    let log = document.getElementById('log')!;
    log.scrollTop = log.scrollHeight;
  });
}, {deep: true})

</script>

<template>
  <div class="controls">
    <ScoreBoard class="card" :score="score"/>
    <div class="card row">
      <h3 class="input-group-text">Random Seed</h3>
      <input type="text" class="form-control" placeholder="Default to timestamp" v-model="seedRef">
      <button class="btn btn-primary" @click="startGame">Start</button>
      <button class="btn" type="button" id="button-addon2"
        @click="seedRef = getNowFormatDate()">Daily Challenge</button>
    </div>
    <div class="card">
      <h3 class="card-header">Journal</h3>
      <div class="card-body">
        <div class="logs" id="log">
          <pre v-for="(log, idx) in logs" :key="idx">{{log}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin-bottom: 1em;
}
.row {
  gap: 1em;
}
.btn {
  flex: 1 0 30%;
}
.form-control {
  width: 100%;
}
.controls {
  padding: 0 1em;
  min-width: 320px;
}
.logs {
  text-align: left;
  max-height: 9em;
  overflow-y: auto;
}
pre {
  margin: 0;
  padding: 0.5em 0;
  border-bottom: 1px dashed currentColor;
  white-space: pre-wrap;
}
</style>
