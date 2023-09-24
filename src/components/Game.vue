<script lang="ts">
import { getRandomData } from './data'

function* chunkTwo<T>(array: T[]) {
  for (let i = 0; i < array.length - 1; i++) {
    yield [array[i], array[i + 1]]
  }
}

// 窗口大小改变事件
function resize() {
  // 设置卡片类的高度等于宽度 字体大小等于宽度的1/4 不超过16px
  let cards = document.getElementsByClassName('game-card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.height = cards[i].offsetWidth + 'px';
    cards[i].style.fontSize = Math.min(cards[i].offsetWidth / 5.3, 16) + 'px';
  }
}

// 生成日期
function getNowFormatDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return year + '-' + month + '-' + day;
}

interface Tile {
  text: string,
  class: string,
  color: string,
  x: number,
  y: number,
}


// 初始化表格数据
function initTableData() {
  // 初始化表格数据
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
  // 遍历每一列
  for (let colIndex = 0; colIndex < 10; colIndex++) {
    // 倒序
    for (let rowIndex = 10 - 1; rowIndex >= 0; rowIndex--) {
      // 如果当前格子的表达式为空，则将当前格子上面的格子的表达式填充到当前格子
      if (tableData[rowIndex][colIndex].text !== '') {
        continue;
      }
      // 延迟0.05秒
      await new Promise(resolve => {
        setTimeout(resolve, 50);
      });
      // 找到当前格子上面的第一个非空格子
      let flag = false;
      for (let i = rowIndex - 1; i >= 0; i--) {
        // 如果找到了非空格子，则将其表达式填充到当前格子
        if (tableData[i][colIndex].text != '') {
          tableData[rowIndex][colIndex].text = tableData[i][colIndex].text;
          tableData[rowIndex][colIndex].color = tableData[i][colIndex].color;
          tableData[i][colIndex].text = '';
          tableData[i][colIndex].color = '';
          flag = true;
          break;
        }
      }
      if (!flag) {
        let [text, color] = getRandomData();
        tableData[rowIndex][colIndex].text = text;
        tableData[rowIndex][colIndex].color = color;
      }
    }
  }
}

// 生成新的表达式
function generateNewText(state) {
  const tableData = state.tableData
  // 遍历每一列
  for (let colIndex = 0; colIndex < 10; colIndex++) {
    // 获取当前列的空格子数量
    let emptyCount = 0;
    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
      // 如果当前格子的表达式为空，则空格子数量加1
      if (tableData[rowIndex][colIndex].text == '') {
        emptyCount++;
      }
    }
    // 随机生成空格子数量个表达式
    for (let i = 0; i < emptyCount; i++) {
      // 随机生成表达式
      let [text, color] = getRandomData();
      // 随机生成空格子的位置
      let rowIndex = Math.floor(Math.random() * (10 - emptyCount));
      // 将表达式填充到空格子的位置
      tableData[rowIndex][colIndex].text = text;
      tableData[rowIndex][colIndex].color = color;
    }
  }
}

// 判断当前格子是否在上一个选中的格子的上下左右四个方向
function canSelectTile(selectedTd: SelectedTd, row: number, col: number) {
  if (selectedTd.length === 0) {
    return true;
  }
  let isSelected = selectedTd.some(td => {
    return row === td.rowIndex && col === td.colIndex
  });
  if (isSelected) {
    return false;
  }
  let {rowIndex, colIndex} = selectedTd[selectedTd.length - 1];
  let isAdjacent =
    (row === rowIndex && Math.abs(col - colIndex) === 1) ||
    (col === colIndex && Math.abs(row - rowIndex) === 1)
  return isAdjacent
}

type SelectedTd = {rowIndex: number, colIndex: number}[];

export default {
  data() {
    return {
      startSelect: false,
      tableData: [] as Tile[][],
      // 用于记录当前点击的格子
      selectedTd: [] as SelectedTd,
      score: 0,
      maxScore: 0,
      log: '',
      seed: '',
    }
  },
  // 初始化
  created() {
    // 绑定窗口大小改变事件
    window.addEventListener('resize', resize);
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
      Math.seedrandom(seed);

      // 初始化表格数据
      this.tableData = initTableData();
      // 初始化分数
      this.score = 0;
      // 初始化日志
      this.log = '一次性消除多个格子会有更高分数\n当前没有连锁消除功能\n当前种子：' + seed + '\n';

      this.$nextTick(() => {
        // 窗口大小改变事件
        resize();
        // 滚动到game组件
        document.getElementById('game')!.scrollIntoView();
      });
    },
    pointerDown(rowIndex: number, colIndex: number) {
      this.startSelect = true
      this.tableData[rowIndex][colIndex].class = 'bg-primary';
      this.selectedTd.push({ rowIndex, colIndex });
    },
    // 点击格子
    pointerMove(rowIndex: number, colIndex: number) {
      if (!this.startSelect || !canSelectTile(this.selectedTd, rowIndex, colIndex)) {
        return;
      }
      // 将当前格子的背景色置为蓝色
      this.tableData[rowIndex][colIndex].class = 'bg-primary';
      // 将上一个选中的格子的背景色置绿色
      console.assert(this.selectedTd.length > 0)
      let lastTd = this.selectedTd[this.selectedTd.length - 1];
      this.tableData[lastTd.rowIndex][lastTd.colIndex].class = 'bg-success';
      this.selectedTd.push({ rowIndex, colIndex });
    },
    // 松开格子
    async pointerUp() {
      await this.tryRemove();
      // 清空选中的格子
      for (const {rowIndex, colIndex} of this.selectedTd) {
        this.tableData[rowIndex][colIndex].class = '';
      }
      this.selectedTd = [];
      this.addLog('-'.repeat(12));
      this.startSelect = false
    },
    async tryRemove() {
      // 如果选中的格子数量小于2，则不需要判断
      if (this.selectedTd.length < 2) {
        return;
      }
      // 获取当前格子的表达式
      const selectedText = this.selectedText()
      // 判断是否可以消除
      let canRemove = true;
      for (let [prevText, currentText] of chunkTwo(selectedText)) {
        // 如果当前格子的表达式与第一个格子的表达式不相同，则不能消除
        if (eval(currentText) != eval(prevText)) {
          canRemove = false;
          this.addLog(currentText + ' != ' + prevText + '，不能消除！');
          break;
        }
      }
      // 如果可以消除，则消除
      if (canRemove) {
        this.doRemove()
      }
    },
    selectedText() {
      return this.selectedTd.map(({rowIndex, colIndex}) => {
        // 移除换行符
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
      // 遍历选中的格子
      for (let i = 0; i < this.selectedTd.length; i++) {
        // 获取当前格子的行号和列号
        let {rowIndex, colIndex} = this.selectedTd[i]
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
      this.addLog('分数增加：' + turnScore);
      // 将剩余的格子向下移动
      await moveDown(this.tableData);
      // 生成新的表达式
      generateNewText(this);
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
    <div class="col-12 col-lg-8">
      <div class="row" v-for="(row, rowIndex) in tableData" :key="rowIndex" id="game">
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
</style>
