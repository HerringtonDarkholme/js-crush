<script lang="ts" setup>
import { getRandomData } from './data'
import { chunkTwo } from './utils'
import {reactive, nextTick} from 'vue'
import ControlPanel from './ControlPanel.vue'

interface Tile {
  text: string,
  class: string,
  color: string,
}

type SelectedCells = {rowIndex: number, colIndex: number}[];

// 初始化表格数据
function initTableData() {
  const tableData: Tile[][] = [];
  for (let i = 0; i < 10; i++) {
    let row = [];
    for (let j = 0; j < 10; j++) {
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
  let hasEliminated = false;
  for (let rowIndex = 10 - 1; rowIndex >= 0; rowIndex--) {
    for (let colIndex = 0; colIndex < 10; colIndex++) {
      const currentCell = tableData[rowIndex][colIndex]
      // if currentCell is not empty, skip
      if (currentCell.text) {
        continue;
      }
      hasEliminated = true;
      // 找到当前格子上面的第一个非空格子
      let flag = false;
      for (let i = rowIndex - 1; i >= 0; i--) {
        const cell = tableData[i][colIndex]
        // 如果找到了非空格子，则将其表达式填充到当前格子
        if (cell.text) {
          currentCell.text = cell.text;
          currentCell.color = cell.color;
          tableData[i][colIndex].text = '';
          tableData[i][colIndex].color = '';
          flag = true;
          break;
        }
      }
      if (!flag) {
        let [text, color] = getRandomData();
        currentCell.text = text;
        currentCell.color = color;
      }
    }
    if (hasEliminated) {
      // delay a little bit for animation
      await new Promise(resolve => setTimeout(resolve, 50));
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
  state.tableData = initTableData();
  state.score = 0;
  state.logs = [`Game Seed: ${seed}`];
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
  await tryRemove();
  // clear selected cell style
  for (const {rowIndex, colIndex} of state.selectedCells) {
    state.tableData[rowIndex][colIndex].class = '';
  }
  state.selectedCells = [];
  state.startSelect = false
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
      addLog(currentText + ' != ' + prevText + '\nNo Crush...');
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
  // 记录日志
  const text = [...chunkTwo(selectedText())]
    .map(([prev, curr]) => `* ${prev} == ${curr}`)
    .join('\n');
  // 计算得分
  let len = state.selectedCells.length;
  let turnScore = 1 + (len - 1) * len / 2;
  state.score += turnScore;
  addLog(text + '\nCrushed!! ' + `Score +${turnScore}`);
  for (let {rowIndex, colIndex} of state.selectedCells) {
    const cell = state.tableData[rowIndex][colIndex]
    // reset text and style
    cell.text = '';
    cell.class = '';
  }
  await moveDown(state.tableData);
}

function addLog(text: string) {
  state.logs.push(text);
}

const state = reactive({
  startSelect: false,
  tableData: [] as Tile[][],
  selectedCells: [] as SelectedCells,
  score: 0,
  logs: [] as string[],
})

</script>

<template>
  <div class="row">
    <div id="game">
      <div class="row" v-for="(row, rowIndex) in state.tableData" :key="rowIndex">
        <div class="col px-0" v-for="(col, colIndex) in row" :key="colIndex">
          <div class="card game-card" :class="col.class"
            @pointerdown="pointerDown(rowIndex, colIndex)"
            @pointerup="pointerUp"
            @pointermove="pointerMove(rowIndex, colIndex)"
            :style="{background: col.color}"
          >
            {{col.text}}
          </div>
        </div>
      </div>
    </div>
    <ControlPanel class="control-panel" :score="state.score" :logs="state.logs" @startGame="startGame"/>
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
}
.highlight {
  transform: translateY(1px) scale(0.98);
  z-index: 2;
  box-shadow: 0px 0px 5px rgba(255, 255, 0, 0.5) inset;
  border-color: yellow;
}
.selected {
  transform: translateY(-1px);
  box-shadow: 0px 2px 5px rgba(255, 255, 0, 0.8),
    0px 2px 10px rgba(255, 255, 0, 0.5),
    0px 2px 15px rgba(255, 255, 0, 0.3);
  z-index: 1;
  border-color: yellow;
}
.row {
  gap: 2px;
  margin: 2px 0;
}

#game {
  max-width: min(100vw, 100vh);
  font-size: min(14px, min(2vw, 2vh));
  user-select: none;
  font-family: monospace;
  margin: -2px 0;
  flex: 8 0 100%;
}
.control-panel {
  flex: 4 0 0;
}
</style>
