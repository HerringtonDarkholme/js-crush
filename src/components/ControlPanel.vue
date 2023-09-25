<script lang="ts" setup>
import { setSeed } from './data'
import { getNowFormatDate } from './utils'
import {ref, defineProps, defineEmits} from 'vue'
import ScoreBoard from './ScoreBoard.vue'
let props = defineProps({
  score: Number,
  log: String,
})
let emit = defineEmits<{
  startGame: string
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

</script>

<template>
  <div class="controls">
    <div class="row">
      <span class="input-group-text">Random Seed</span>
      <input type="text" class="form-control" placeholder="Default to timestamp" v-model="seedRef">
      <button class="btn btn-primary" @click="startGame">Start</button>
      <button class="btn" type="button" id="button-addon2"
        @click="seedRef = getNowFormatDate()">Daily Challenge</button>
    </div>
    <ScoreBoard :score="score"/>
    <div class="text-dark">
      <div class="card-header">
        Log
      </div>
      <div class="card-body">
        <textarea class="form-control" rows="10" readonly id="log">{{log}}</textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  padding: 1em;
  min-width: 320px;
}
</style>
