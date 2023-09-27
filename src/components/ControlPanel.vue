<script lang="ts" setup>
import {watch, nextTick} from 'vue'
import ScoreBoard from './ScoreBoard.vue'
import { logs, seedRef, share } from './state'
// scroll logs to bottom to show latest update
watch(logs, () => {
  nextTick(() => {
    let log = document.getElementById('log')!;
    log.scrollTo({
      top: log.scrollHeight,
      behavior: 'smooth'
    })
  });
}, {deep: true})

</script>

<template>
  <div class="controls">
    <ScoreBoard class="card"/>
    <div class="card row">
      <h3 class="input-group-text">RNG Seed</h3>
      <small>Same seed generates same board</small>
      <input type="text" class="form-control" placeholder="Default seed is hex timestamp" v-model="seedRef">
    </div>
    <div class="card">
      <h3 class="card-header">Journal</h3>
      <div class="card-body">
        <div class="logs" id="log">
          <pre v-for="(log, idx) in logs" :key="idx">{{log}}</pre>
        </div>
      </div>
    </div>
    <button class="btn" @click="share">
      Share on 𝕏
    </button>
    <br/>
    <br/>
    <br/>
    <p>
      Made by <a href="https://twitter.com/hd_nvim" target="_blank">Herrington Darkholme</a>.
      <br/>
      If you like the game, you can support me by giving
      <a href="https://github.com/ast-grep/ast-grep" target="_blank">ast-grep</a> a star😉.
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
  width: 100%;
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
