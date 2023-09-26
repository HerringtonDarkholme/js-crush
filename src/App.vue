<script setup lang="ts">
import Game from './components/Game.vue'
</script>
<template>
  <div class="container mt-3">
    <div class="intro">
      <h1>JS Crush</h1>
      <p>
        A parody game inspired by
        <a href="https://www.thomas-yang.me/projects/oh-my-dear-js/"
        target="_blank">oh-my-dear-js</a> and
        <a href="https://js.wdn.md/" target="_blank">nice.js</a>.</p>
      <p>
        Instruction: Click <b>Start</b> to begin your challenge!
        Drag your mouse over two or more nearby tiles that are <code>==</code> to each other.
        Release your mouse and watch tiles removed if they are all weakly equal to their neighbors.
      </p>
    </div>
    <Game/>
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
</style>
