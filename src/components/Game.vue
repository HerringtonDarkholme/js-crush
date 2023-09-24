<script lang="ts">
import { getRandomData, setSeed } from './data'
import { chunkTwo, getNowFormatDate } from './utils'

interface Tile {
  text: string,
  class: string,
  color: string,
  x: number,
  y: number,
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
        x: i,
        y: j,
      });
    }
    tableData.push(row);
  }
  return tableData
}
// 将剩余的格子向下移动
async function moveDown(tableData: Tile[][]) {
  for (let rowIndex = 10 - 1; rowIndex >= 0; rowIndex--) {
    for (let colIndex = 0; colIndex < 10; colIndex++) {
      const currentCell = tableData[rowIndex][colIndex]
      // if currentCell is not empty, skip
      if (currentCell.text) {
        continue;
      }
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
    // 延迟0.05秒
    await new Promise(resolve => setTimeout(resolve, 50));
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


export default {
  data() {
    return {
      startSelect: false,
      tableData: [] as Tile[][],
      selectedCells: [] as SelectedCells,
      score: 0,
      maxScore: 0,
      log: '',
      seed: '',
    }
  },
  methods: {
    // 开始游戏
    async startGame() {
      // 初始化随机数种子
      let seed = this.seed;
      if (this.seed == '') {
        // 当前时间戳
        seed = new Date().getTime().toString();
      }
      setSeed(seed);

      this.tableData = initTableData();
      this.score = 0;
      this.log = '一次性消除多个格子会有更高分数\n当前没有连锁消除功能\n当前种子：' + seed + '\n';

      // 滚动到game组件
      this.$nextTick(() => {
        document.getElementById('game')!.scrollIntoView();
      });
    },
    pointerDown(rowIndex: number, colIndex: number) {
      this.startSelect = true
      this.tableData[rowIndex][colIndex].class = 'bg-primary';
      this.selectedCells.push({ rowIndex, colIndex });
    },
    // 点击格子
    pointerMove(rowIndex: number, colIndex: number) {
      if (!this.startSelect || !canSelectTile(this.selectedCells, rowIndex, colIndex)) {
        return;
      }
      // 将当前格子的背景色置为蓝色
      this.tableData[rowIndex][colIndex].class = 'bg-primary';
      // 将上一个选中的格子的背景色置绿色
      console.assert(this.selectedCells.length > 0)
      let lastTd = this.selectedCells[this.selectedCells.length - 1];
      this.tableData[lastTd.rowIndex][lastTd.colIndex].class = 'bg-success';
      this.selectedCells.push({ rowIndex, colIndex });
    },
    // 松开格子
    async pointerUp() {
      await this.tryRemove();
      // clear selected cell style
      for (const {rowIndex, colIndex} of this.selectedCells) {
        this.tableData[rowIndex][colIndex].class = '';
      }
      this.selectedCells = [];
      this.addLog('-'.repeat(12));
      this.startSelect = false
    },
    async tryRemove() {
      // no removal if only one selected cell
      if (this.selectedCells.length < 2) {
        return;
      }
      const selectedText = this.selectedText()
      let canRemove = true;
      for (let [prevText, currentText] of chunkTwo(selectedText)) {
        if (eval(currentText) != eval(prevText)) {
          canRemove = false;
          this.addLog(currentText + ' != ' + prevText + '，不能消除！');
          break;
        }
      }
      if (canRemove) {
        await this.doRemove()
      }
    },
    // return the array of selected cell text, normalized
    selectedText() {
      return this.selectedCells.map(({rowIndex, colIndex}) => {
        return this.tableData[rowIndex][colIndex].text.replace(/\n/g, '')
      });
    },
    async doRemove() {
      // 记录日志
      const text = [...chunkTwo(this.selectedText())]
        .map(([prev, curr]) => `${prev} == ${curr}`)
        .join('\n');
      this.addLog(text + '\n消除成功！');
      // 计算得分
      let turnScore = 1;
      for (let i = 0; i < this.selectedCells.length; i++) {
        let {rowIndex, colIndex} = this.selectedCells[i]
        const cell = this.tableData[rowIndex][colIndex]
        // reset text and style
        cell.text = '';
        cell.class = '';
        // 计算得分
        turnScore += i;
      }
      // 计算得分
      this.score += turnScore;
      // 更新最高得分
      this.maxScore = Math.max(this.score, this.maxScore);
      // 将剩余的格子向下移动
      await moveDown(this.tableData);
    },
    addLog(text: string) {
      this.log += text + '\n';
      // 滚动到底部
      this.$nextTick(() => {
        let log = document.getElementById('log')!;
        log.scrollTop = log.scrollHeight;
      });
    },
    getNowFormatDate,
  },
};
</script>

<template>
  <div class="row mt-3">
    <div class="col-12 col-lg-8" id="game">
      <div class="row" v-for="(row, rowIndex) in tableData" :key="rowIndex">
        <div class="col px-0" v-for="(col, colIndex) in row" :key="colIndex">
          <!-- 要兼容移动端 -->
          <div class="card game-card text-center" :class="col.class"
            @pointerdown="pointerDown(rowIndex, colIndex)"
            @pointerup="pointerUp"
            @pointermove="pointerMove(rowIndex, colIndex)"
          >
            <!-- 文字纵向居中 允许换行 r1圆角-->
            <div class="card-body p-0 d-flex align-items-center justify-content-center"
              style="height: 100%; word-break: break-word; border-radius: 0.25rem;"
              :style="{background: col.color}">
              {{col.text}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 控制面板等 -->
    <div class="col-12 col-lg-4">
      <!-- 随机数种子输入栏，不填则随机，并且有不填随机的提示，右侧有个按钮是使用当前日期 -->
      <div class="input-group mb-3">
        <span class="input-group-text">随机数种子</span>
        <input type="text" class="form-control" placeholder="不填则随机" v-model="seed">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2"
          @click="seed = getNowFormatDate()">每日挑战</button>
      </div>
      <br />
      <button class="btn btn-primary" @click="startGame" style="width: 100%;">开始/重新开始</button>
      <br /><br />
      <!-- 计分板 -->
      <div class="card text-dark bg-transparent">
        <div class="card-header">
          计分板
          <small class="text-muted">
            * 刷新将会重置
          </small>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-6 col-lg-12">
              <p>当前得分：{{score}}</p>
            </div>
            <div class="col-6 col-lg-12">
              <p>最高得分：{{maxScore}}</p>
            </div>
          </div>
        </div>
      </div>
      <br />
      <!-- 日志框 -->
      <div class="card text-dark bg-transparent">
        <div class="card-header">
          日志框
        </div>
        <div class="card-body">
          <!-- 一个多行文本框，用于记录日志 -->
          <textarea class="form-control" rows="10" readonly id="log">{{log}}</textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0px 0px 10px rgba(255, 255, 0, 0.3); /* Add a subtle box-shadow */
  transition: all 0.2s ease-in-out;
}
.bg-success {
  transform: scale(1.05);
  z-index: 1;
}

.game-card {
  aspect-ratio: 1;
  width: 100%;
}

#game {
  max-width: min(100vw, 100vh);
  font-size: min(16px, min(2vw, 2vh));
  user-select: none;
}
</style>
