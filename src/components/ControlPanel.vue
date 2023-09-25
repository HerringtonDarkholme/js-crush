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
  // 初始化随机数种子
  let seed = seedRef.value;
  if (!seed) {
    // 当前时间戳
    seed = new Date().getTime().toString();
  }
  setSeed(seed);
  emit('startGame', seed)
}

</script>

<template>
  <div>
    <div class="input-group mb-3">
      <span class="input-group-text">随机数种子</span>
      <input type="text" class="form-control" placeholder="不填则随机" v-model="seedRef">
      <button class="btn" type="button" id="button-addon2"
        @click="seedRef = getNowFormatDate()">每日挑战</button>
    </div>
    <br />
    <button class="btn btn-primary" @click="startGame">Restart</button>
    <ScoreBoard :score="score"/>
    <div class="text-dark">
      <div class="card-header">
        日志框
      </div>
      <div class="card-body">
        <textarea class="form-control" rows="10" readonly id="log">{{log}}</textarea>
      </div>
    </div>
  </div>
</template>
<style scoped>
.btn {
  width: 100%;
}
.form-control {
  width: 100%;
}
</style>
