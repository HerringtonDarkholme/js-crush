<script lang="ts" setup>
import Game from './Game.vue';
import { shareToTwitter } from './utils'
import { startNewGame, score, title, life } from './state'
import { shuffle } from './sound'
import { nextTick, ref} from 'vue'

enum Step {
  NotStart,
  Started,
  GameOver,
}

let step = ref(Step.NotStart)
// 开始游戏
async function startGame() {
  step.value = Step.Started
  shuffle()
  startNewGame()
  nextTick(() => {
    document.getElementById('game')!.scrollIntoView();
  });
}
function share() {
  const message = `I scored ${score.value} points on #JSCrush as a ${title.value[1]}!`
  shareToTwitter(message)
}
</script>

<template>
  <div class="game-area">
    <div class="intro" v-if="step === Step.NotStart">
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
      <p>
        <button class="btn btn-primary" @click="startGame">Start</button>
      </p>
    </div>
    <transition>
      <div class="game-over" v-if="life === 0">
        <div class="panel">
          <h1>Game Over</h1>
          <p>
            You scored {{score}} points and earned the title of {{title[1]}}.
          </p>
        </div>
        <div class="row">
          <button class="btn" @click="startGame">Try Again</button>
          <button class="btn" @click="share">
            Share on 𝕏
          </button>
        </div>
      </div>
    </transition>
    <Game/>
  </div>
</template>

<style scoped>
.game-area {
  position: relative;
  min-height: 60vh;
}
.intro, .game-over {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1em;
}
.game-over {
  backdrop-filter: blur(3px) grayscale(85%);
  z-index: 3;
  transition: all 0.2s ease-in-out;
  align-items: center;
}
.v-leave-to, .v-enter-from {
  opacity: 0;
}
.game-over h1 {
  margin: 0;
}
.row {
  width: 100%;
  gap: 1em;
  justify-content: center;
}
.game-over .btn {
  flex: 1 1 256px;
  max-width: 256px;
}
.btn {
  width: 100%;
}
.panel {
  text-shadow: 0 2px 6px;
  font-weight: bold;
}
</style>
