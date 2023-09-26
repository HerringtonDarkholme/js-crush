<script lang="ts" setup>
import { setSeed } from './data'
import { getNowFormatDate } from './utils'
import {ref, watch, nextTick} from 'vue'
import ScoreBoard from './ScoreBoard.vue'
import { logs } from './logs'
let props = defineProps({
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

function shareToTwitter() {
  // Encode the url and message as query parameters
  const encodedUrl = encodeURIComponent(location.href);
  const encodedMessage = encodeURIComponent(`I scored ${props.score} points on #JSCrush! I can handle JavaScript coercion like a pro.`);
  // Construct the Twitter share url with the query parameters
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`;
  // Open a new window with the Twitter share url
  window.open(twitterUrl, "_blank");
}

</script>

<template>
  <div class="controls">
    <div class="card row">
      <button class="btn btn-primary" @click="startGame">Start</button>
      <button class="btn" type="button" id="button-addon2"
        @click="seedRef = getNowFormatDate()">Daily Challenge</button>
    </div>
    <ScoreBoard class="card" :score="score"/>
    <div class="card row">
      <h3 class="input-group-text">RNG Seed</h3>
      <small>Same seed generates same board</small>
      <input type="text" class="form-control" placeholder="Default seed is timestamp" v-model="seedRef">
    </div>
    <div class="card">
      <h3 class="card-header">Journal</h3>
      <div class="card-body">
        <div class="logs" id="log">
          <pre v-for="(log, idx) in logs" :key="idx">{{log}}</pre>
        </div>
      </div>
    </div>
    <button class="tweet-button" @click="shareToTwitter">
      Share on 𝕏
    </button>
    <br/>
    <br/>
    <br/>
    <p>
      Made by <a href="https://twitter.com/hd_nvim" target="_blank">Herrington Darkholme</a>.
      <br/>
      If you like the game, you can support me by giving
      <a href="https://github.com/ast-grep/ast-grep" target="_blank">my other project</a> a star😉.
    </p>
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
  box-sizing: border-box;
}
.logs {
  text-align: left;
  height: 9em;
  overflow-y: auto;
  border-radius: 8px;
  background-color: #1a1a1a;
  border: 1px dashed currentColor;
}
@media (prefers-color-scheme: light) {
  .logs {
    background-color: #f9f9f9;
  }
}
pre {
  margin: 0;
  padding: 0.5em;
  border-bottom: 1px dashed currentColor;
  white-space: pre-wrap;
}
.tweet-button {
  width: 100%;
}
small {
  font-weight: lighter;
  line-height: 28px;
}
</style>
