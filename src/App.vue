<script setup lang="ts">
import Game from './components/Game.vue'
</script>
<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <div>
            <h4 class="alert-heading">nice.js ——js真值表消消乐</h4>
            <div class="float-end">
              <span class="badge bg-primary">作者：@电子旅人</span>
              <span class="badge bg-secondary">v0.8</span>
            </div>
          </div>
          <br /><br />
          <p>本页面灵感来源于<a href="https://www.thomas-yang.me/projects/oh-my-dear-js/"
            target="_blank">oh-my-dear-js</a>，遇到迷惑情况也可以去看一下。仅供娱乐，想象中是作为一个语言律(wu)师的比拼工具或者什么。</p>
          <p>使用方法：点击下方的**开始**开始你的挑战，点击并拖选多个方块，如果这些方块依次与邻接的方块的值相等（使用`==`比较为true），则可以消除。</p>
          <p>邻接判断意味着，虽然`String("")`和`[0]`不相等，不能消除，但`String("")->Number(0)->[0]`的连接是可以消除的。因为两两相比较都是true。
          </p>
          <p>
          随机数种子可以用来生成相同的局面，这方便与多人以相同开局对比能力，种子如果留空则每局都不一样。
          附带的每日挑战功能，将会以当前日期作为种子，后续可能出个每日排行榜，但当前还没做。
          </p>
        </div>
      </div>
    </div>
    <Game/>
  </div>
</template>
