<script lang="ts" setup>
import { getRandomData } from './data'
import { addLog, resetLog } from './logs'
import { chunkTwo } from './utils'
import {reactive, nextTick} from 'vue'
import ControlPanel from './ControlPanel.vue'

interface Tile {
  text: string,
  class: string,
  color: string,
}

const SIZE = 8;
type SelectedCells = {rowIndex: number, colIndex: number}[];

// 初始化表格数据
function initTableData() {
  const tableData: Tile[][] = [];
  for (let i = 0; i < SIZE; i++) {
    let row = [];
    for (let j = 0; j < SIZE; j++) {
      let [text, color] = getRandomData();
      row.push({
        text: text,
        class: '',
        color: color,
      });
    }
    tableData.push(row);
  }
  return tableData
}
// 将剩余的格子向下移动
async function moveDown(tableData: Tile[][]) {
  for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
    const row = tableData[rowIndex]
    let colIndex = 0
    while (colIndex < SIZE) {
      if (colIndex >= row.length) {
        const [text, color] = getRandomData()
        row.push({
          text, color, class: ''
        })
        colIndex += 1
        await new Promise(resolve => setTimeout(resolve, 50));
      } else if (row[colIndex].class === 'removing') {
        row.splice(colIndex, 1)
        await new Promise(resolve => setTimeout(resolve, 50));
      } else {
        colIndex += 1
      }
    }
  }
}

function canSelectTile(selectedCells: SelectedCells, row: number, col: number) {
  if (!selectedCells.length) {
    return true;
  }
  let isSelected = selectedCells.some(cell => {
    return row === cell.rowIndex && col === cell.colIndex
  });
  if (isSelected) {
    return false;
  }
  let {rowIndex, colIndex} = selectedCells[selectedCells.length - 1];
  let isAdjacent =
    (row === rowIndex && Math.abs(col - colIndex) === 1) ||
    (col === colIndex && Math.abs(row - rowIndex) === 1)
  return isAdjacent
}

// 开始游戏
async function startGame(seed: string) {
  state.tableData = initTableData()
  state.score = 0
  resetLog(seed)
  nextTick(() => {
    document.getElementById('game')!.scrollIntoView();
  });
}

function pointerDown(rowIndex: number, colIndex: number) {
  state.startSelect = true
  state.tableData[rowIndex][colIndex].class = 'highlight';
  state.selectedCells.push({ rowIndex, colIndex });
}

function pointerMove(rowIndex: number, colIndex: number) {
  if (!state.startSelect || !canSelectTile(state.selectedCells, rowIndex, colIndex)) {
    return;
  }
  // 将当前格子的背景色置为蓝色
  state.tableData[rowIndex][colIndex].class = 'highlight';
  // 将上一个选中的格子的背景色置绿色
  console.assert(state.selectedCells.length > 0)
  let lastTd = state.selectedCells[state.selectedCells.length - 1];
  state.tableData[lastTd.rowIndex][lastTd.colIndex].class = 'selected';
  state.selectedCells.push({ rowIndex, colIndex });
}

// 松开格子
async function pointerUp() {
  state.startSelect = false
  await tryRemove();
  // clear selected cell style
  for (const {rowIndex, colIndex} of state.selectedCells) {
    state.tableData[rowIndex][colIndex].class = '';
  }
  state.selectedCells = [];
}

async function tryRemove() {
  // no removal if only one selected cell
  if (state.selectedCells.length < 2) {
    return;
  }
  const text = selectedText()
  let canRemove = true;
  for (let [prevText, currentText] of chunkTwo(text)) {
    if (eval(currentText) != eval(prevText)) {
      canRemove = false;
      addLog({
        type: 'NoCrush',
        currentText,
        prevText,
      })
      break;
    }
  }
  if (canRemove) {
    await doRemove()
  }
}
// return the array of selected cell text, normalized
function selectedText() {
  return state.selectedCells.map(({rowIndex, colIndex}) => {
    return state.tableData[rowIndex][colIndex].text.replace(/\n/g, '')
  });
}
async function doRemove() {
  let len = state.selectedCells.length;
  let turnScore = 1 + (len - 1) * len / 2;
  state.score += turnScore;
  addLog({
    type: 'Crushed',
    selectedText: selectedText(),
    turnScore,
  });
  for (let {rowIndex, colIndex} of state.selectedCells) {
    const cell = state.tableData[rowIndex][colIndex]
    // reset text and style
    cell.class = 'removing';
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  await new Promise(resolve => setTimeout(resolve, 400));
  await moveDown(state.tableData);
}

const state = reactive({
  startSelect: false,
  tableData: [] as Tile[][],
  selectedCells: [] as SelectedCells,
  score: 0,
})

</script>

<template>
  <div class="row">
    <div id="game" @pointerup="pointerUp">
      <div class="tiles" v-for="(row, rowIndex) in state.tableData" :key="rowIndex">
        <div class="tile" v-for="(col, colIndex) in row" :key="colIndex">
          <div class="card game-card" :class="col.class"
            @pointerdown="pointerDown(rowIndex, colIndex)"
            @pointermove="pointerMove(rowIndex, colIndex)"
            :style="{'--tile-color': col.color}"
          >
            {{col.text}}
          </div>
        </div>
      </div>
    </div>
    <ControlPanel class="control-panel" :score="state.score" @startGame="startGame"/>
  </div>
</template>

<style scoped>
.game-card {
  aspect-ratio: 1;
  word-break: break-word;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image:
    radial-gradient(
      100% 100% at 100% 0,
      var(--tile-color) 0,
      color-mix(in hsl, var(--tile-color) 80%, black) 100%
    );
  box-shadow:
    rgba(45, 35, 66, .4) 0 2px 4px,
    rgba(45, 35, 66, .3) 0 7px 13px -3px,
    color-mix(in hsl, var(--tile-color) 60%, black) 0 -3px 0 inset;
  transform-origin: 50% 50%;
}


.highlight {
  box-shadow: color-mix(in hsl, var(--tile-color) 60%, black) 0 3px 7px inset;
  transform: translateY(2px) scale(0.98);
  z-index: 2;
  /*border-color: yellow;*/
}
.selected {
  transform: translateY(-2px);
  box-shadow:
    rgba(45, 35, 66, .4) 0 4px 8px,
    rgba(45, 35, 66, .3) 0 7px 13px -3px,
    color-mix(in hsl, var(--tile-color) 50%, black) 0 -3px 0 inset;
  z-index: 1;
  /*border-color: yellow;*/
}
.removing {
  animation: disappear 0.4s linear forwards;
}
@keyframes disappear {
  from {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
  20% {
    transform: scale(1.05) rotate(-2deg);
    opacity: 1;
  }
  40% {
    transform: scale(1.05) rotate(-2deg);
    opacity: 1;
  }
  to {
    transform: scale(0) rotate(-2deg);
    opacity: 0.5;
  }
}

#game {
  max-width: 100vmin;
  font-size: min(14px, 2.5vmin);
  user-select: none;
  font-family: monospace;
  margin: -2px 0;
  flex: 8 0 100%;
  touch-action: none;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: 2px;
}
.tiles {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column-reverse;
  flex: 1 0 0;
  gap: 2px;
  justify-content: flex-start;
}
.tile {
  flex: 0 0 0;
}
.control-panel {
  flex: 4 0 0;
}
</style>
