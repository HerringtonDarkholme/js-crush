<script setup lang="ts">
import MainArea from './components/MainArea.vue'
import ControlPanel from './components/ControlPanel.vue'

</script>

<template>
  <div class="container mt-3">
    <h1>JS Crush</h1>
    <div class="row">
      <MainArea class="game-area" />
      <ControlPanel class="control-panel"/>
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
