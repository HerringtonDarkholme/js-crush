<script setup lang="ts">
import Game from './components/Game.vue'
</script>
<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <h1>JS Crush</h1>
          <p>
            Inspired by
            <a href="https://www.thomas-yang.me/projects/oh-my-dear-js/"
            target="_blank">oh-my-dear-js</a></p>
          <p>
            Instruction: Click <b>Start</b> to begin your challenge!
            Click and Swipe tiles and make sure two neighbor tiles are `==`.
            Release your swipe and eliminate all tiles if they are all weakly equal to their neighbors.
          </p>
          <p> Note, only two adjacent tiles are compared. That means that even if `String("") != [0]`,  you can eliminate
          all three tiles by following the path `String("") -> Number(0) -> [0]`.
          </p>
          <p>
          Seed is for generating puzzles. You will always see the same board for the same seed.
          </p>
        </div>
      </div>
    </div>
    <Game/>
  </div>
</template>
