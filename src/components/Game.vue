<script lang="ts" setup>
import { getRandomData, isEqual } from './data'
import { addLog, addScore, Tile, size, tableData } from './state'
import { chunkTwo, sleep } from './utils'
import {reactive} from 'vue'
import { tile, correct, wrong } from './sound'

type SelectedCells = {rowIndex: number, colIndex: number}[];
// 将剩余的格子向下移动
async function moveDown(tableData: Tile[][]) {
  for (let rowIndex = 0; rowIndex < size(); rowIndex++) {
    const row = tableData[rowIndex]
    let colIndex = 0
    while (colIndex < size()) {
      if (colIndex >= row.length) {
        const [text, color] = getRandomData()
        row.push({
          text, color, class: ''
        })
        colIndex += 1
        await sleep(50)
      } else if (row[colIndex].class === 'removing') {
        row.splice(colIndex, 1)
        await sleep(50)
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

function resolveCoordinate(e: PointerEvent) {
  const target = document.elementFromPoint(e.clientX, e.clientY)!;
  if (!target.classList.contains('game-card')) {
    return [NaN, NaN]
  }
  const row = Number(target.getAttribute('x'))
  const col = Number(target.getAttribute('y'))
  return [row, col]
}

let startSelect = false

function pointerDown(e: PointerEvent) {
  const [rowIndex, colIndex] = resolveCoordinate(e)
  if (isNaN(rowIndex) || isNaN(colIndex)) {
    return
  }
  tile()
  startSelect = true
  tableData.value[rowIndex][colIndex].class = 'highlight';
  state.selectedCells.push({ rowIndex, colIndex });
}

function pointerMove(e: PointerEvent) {
  const [rowIndex, colIndex] = resolveCoordinate(e)
  if (!startSelect || isNaN(rowIndex) || isNaN(colIndex) || !canSelectTile(state.selectedCells, rowIndex, colIndex)) {
    return;
  }
  tile()
  tableData.value[rowIndex][colIndex].class = 'highlight';
  console.assert(state.selectedCells.length > 0)
  let lastTd = state.selectedCells[state.selectedCells.length - 1];
  tableData.value[lastTd.rowIndex][lastTd.colIndex].class = 'selected';
  state.selectedCells.push({ rowIndex, colIndex });
}

// 松开格子
async function pointerUp() {
  startSelect = false
  await tryRemove();
  // clear selected cell style
  for (const {rowIndex, colIndex} of state.selectedCells) {
    tableData.value[rowIndex][colIndex].class = '';
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
    if (!isEqual(prevText, currentText)) {
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
    correct()
    await doRemove()
  } else {
    for (let {rowIndex, colIndex} of state.selectedCells) {
      tableData.value[rowIndex][colIndex].class = 'wrong-select'
    }
    wrong()
    await sleep(500)
  }
}
// return the array of selected cell text, normalized
function selectedText() {
  return state.selectedCells.map(({rowIndex, colIndex}) => {
    return tableData.value[rowIndex][colIndex].text.replace(/\n/g, '')
  });
}
async function doRemove() {
  addScore(selectedText())
  for (let {rowIndex, colIndex} of state.selectedCells) {
    const cell = tableData.value[rowIndex][colIndex]
    cell.class = 'removing'
    await sleep(50)
  }
  await sleep(400)
  await moveDown(tableData.value)
}

const state = reactive({
  selectedCells: [] as SelectedCells,
})

</script>

<template>
  <div id="game" @pointerup="pointerUp" @pointerdown="pointerDown" @pointermove="pointerMove">
    <div class="tiles" v-for="(row, rowIndex) in tableData" :key="rowIndex">
      <div class="tile" v-for="(col, colIndex) in row" :key="colIndex">
        <div class="card game-card" :class="col.class"
          :x="rowIndex" :y="colIndex"
          :style="{'--tile-color': col.color}"
        >
          {{col.text}}
        </div>
      </div>
    </div>
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
  --shadow: rgb(236, 233, 186);
  box-shadow:
    color-mix(in srgb, var(--shadow) 40%, transparent) 0 2px 4px,
    color-mix(in srgb, var(--shadow) 30%, transparent) 0 7px 13px -3px,
    color-mix(in hsl, var(--tile-color) 60%, black) 0 -3px 0 inset;
  transform-origin: 50% 50%;
  white-space: pre-wrap;
  line-height: 1;
}
@media (prefers-color-scheme: light) {
  .game-card {
    --shadow: rgb(45, 35, 66);
  }
}


.highlight {
  box-shadow: color-mix(in hsl, var(--tile-color) 60%, black) 0 3px 7px inset;
  transform: translateY(2px) scale(0.98);
  z-index: 2;
}
.selected {
  transform: translateY(-2px);
  box-shadow:
    color-mix(in srgb, var(--shadow) 40%, transparent) 0 4px 8px,
    color-mix(in srgb, var(--shadow) 30%, transparent) 0 7px 13px -3px,
    color-mix(in hsl, var(--tile-color) 50%, black) 0 -3px 0 inset;
  z-index: 1;
}
.removing {
  animation: disappear 0.4s linear forwards;
  --shadow: green;
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

.wrong-select {
  animation: shake 0.5s ease-in-out 0s;
  --shadow: red;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(3px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

#game {
  width: min(100vmin, 750px);
  font-size: min(14px, 3vmin);
  user-select: none;
  font-family: monospace;
  touch-action: none;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: min(0.8vmin, 6px);
}
.tiles {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column-reverse;
  flex: 1 0 0;
  gap: min(0.8vmin, 6px);
  justify-content: flex-start;
}
.tile {
  flex: 0 0 0;
}
</style>
