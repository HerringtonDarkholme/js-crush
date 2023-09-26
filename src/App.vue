<script setup lang="ts">
import { nextTick} from 'vue'
import MainArea from './components/MainArea.vue'
import ControlPanel from './components/ControlPanel.vue'
import { startNewGame } from './components/state'
import { shuffle } from './components/sound'

// 开始游戏
async function startGame(seed: string) {
  shuffle()
  startNewGame(seed)
  nextTick(() => {
    document.getElementById('game')!.scrollIntoView();
  });
}
</script>

<template>
  <div class="container mt-3">
    <div class="intro">
      <h1>JS Crush</h1>
      <p>
        A bizarre JS-Equality puzzle inspired by
        <a href="https://www.thomas-yang.me/projects/oh-my-dear-js/"
        target="_blank">oh-my-dear-js</a> and
        <a href="https://js.wdn.md/" target="_blank">nice.js</a>.</p>
      <p>
        Instruction: Click <b>Start</b> to begin your challenge!
        Drag your mouse over two or more nearby tiles that are <code>==</code> to each other.
        Release your mouse and watch tiles removed if they are all weakly equal to their neighbors.
      </p>
    </div>
    <div class="row">
      <MainArea class="game-area" />
      <ControlPanel class="control-panel" @startGame="startGame"/>
    </div>
  </div>
</template>

<style scoped>
.intro {
  padding: 0 1em;
  width: 100%;
  box-sizing: border-box;
}
p {
  width: 100%;
}
sub {
  margin-top: -10em;
}
.control-panel {
  flex: 4 0 0;
}
.game-area {
  flex: 8 0 0;
  min-width: min(500px, 100vw);
  display: flex;
  justify-content: center;
  margin-bottom: 2em;
}
</style>
