<script lang="ts">

// 窗口大小改变事件
function resize() {
  // 设置卡片类的高度等于宽度 字体大小等于宽度的1/4 不超过16px
  let cards = document.getElementsByClassName('game-card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.height = cards[i].offsetWidth + 'px';
    cards[i].style.fontSize = Math.min(cards[i].offsetWidth / 5.3, 16) + 'px';
  }
}

// 获取随机的颜色
function getRandomColor() {
  // 生成低饱和度的浅彩色十六进制
  // 色调 0~1
  // 饱和度 0.5~1
  // 亮度 0.8~0.95
  let hue = Math.random();
  let saturation = Math.random() * 0.5 + 0.5;
  let lightness = Math.random() * 0.15 + 0.8;
  let rgb = hslToRgb(hue, saturation, lightness);
  return '#' + rgbToHex(rgb[0]) + rgbToHex(rgb[1]) + rgbToHex(rgb[2]);
}
// HSL转RGB
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    let hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
// RGB转十六进制
function rgbToHex(rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
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

// 获取随机的表达式和颜色
function getRandomData(state) {
  let r = Math.floor(Math.random() * state.exprData.length);
  let data = state.exprData[r];
  let color = state.exprColor[r];
  return [data, color];
}

// 初始化表格数据
async function initTableData(state) {
  // 初始化表格数据
  state.tableData = [];
  for (let i = 0; i < 10; i++) {
    let row = [];
    for (let j = 0; j < 10; j++) {
      let [text, color] = getRandomData(state);
      row.push({
        text: text,
        class: '',
        color: color,
        x: i,
        y: j,
      });
    }
    state.tableData.push(row);
  }
}

export default {
  data() {
    return {
      tableData: [],
      // 用于记录当前点击的格子
      selectedTd: [],
      // 表达式数据
      exprData: ['null', 'undefined', 'false', 'Boolean\n(false)', '[]', '[[]]', '""', 'String\n("")', '0', 'Number\n(0)', '"0"', 'String\n("0")', '[0]', 'true', 'Boolean\n(true)', '1', 'Number\n(1)', '"1"', 'String\n("1")', '[1]', '-1', 'Number\n(-1)', '"-1"', 'String\n("-1")', '[-1]'],
      exprColor: [],
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
    startGame: async function () {
      // 初始化随机数种子
      let seed = this.seed;
      if (this.seed == '') {
        // 当前时间戳
        seed = new Date().getTime().toString();
      }
      Math.seedrandom(seed);

      // 初始化表达式颜色列表
      this.exprColor = [];
      for (let i = 0; i < this.exprData.length; i++) {
        this.exprColor.push(getRandomColor());
      }
      // 初始化表格数据
      initTableData(this);

      this.$nextTick(() => {
        // 窗口大小改变事件
        resize();
        // 滚动到game组件
        document.getElementById('game').scrollIntoView();
      });

      // 初始化分数
      this.score = 0;
      // 初始化日志
      this.log = '一次性消除多个格子会有更高分数\n当前没有连锁消除功能\n当前种子：' + seed + '\n';
    },
    // 点击格子
    clickTdMouseDown(rowIndex, colIndex) {
      // 如果是鼠标模式并且左键没有按下
      if (event.type == 'mousedown' || event.type == 'mousemove' || event.type == 'mouseup') {
        // 如果是左键没有按下
        if (event.buttons != 1) {
          return;
        }
      }
      // 如果当前格子没有被选中，则选中
      // 获取当前格子 使用document.elementFromPoint

      if (event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend') {
        let x, y;
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
        let td = document.elementFromPoint(x, y);
        // 如果当前格子不是game-card或者game-card的子元素，则不需要处理
        let flagc = false;
        while (td) {
          if (td.classList.contains('game-card')) {
            flagc = true;
            break;
          }
          td = td.parentElement;
        }
        if (flagc) {
          // 更新行列
          rowIndex = parseInt(td.getAttribute('x'));
          colIndex = parseInt(td.getAttribute('y'));
        }
      }


      // 如果当前格子已经被选中，则不需要处理
      for (let i = 0; i < this.selectedTd.length; i++) {
        if (this.selectedTd[i].rowIndex == rowIndex && this.selectedTd[i].colIndex == colIndex) {
          return;
        }
      }
      // 判断当前格子是否在上一个选中的格子的上下左右四个方向
      let flag = false;

      if (this.selectedTd.length == 0) {
        flag = true;
      } else {
        let lastTd = this.selectedTd[this.selectedTd.length - 1];
        if (lastTd) {
          if (rowIndex == lastTd.rowIndex && colIndex == lastTd.colIndex - 1) {
            // 如果当前格子在上一个选中的格子的左边，则选中当前格子
            flag = true;
          }
          else if (rowIndex == lastTd.rowIndex && colIndex == lastTd.colIndex + 1) {
            // 如果当前格子在上一个选中的格子的右边，则选中当前格子
            flag = true;
          }
          else if (rowIndex == lastTd.rowIndex - 1 && colIndex == lastTd.colIndex) {
            // 如果当前格子在上一个选中的格子的上边，则选中当前格子
            flag = true;
          }
          else if (rowIndex == lastTd.rowIndex + 1 && colIndex == lastTd.colIndex) {
            // 如果当前格子在上一个选中的格子的下边，则选中当前格子
            flag = true;
          }
        }
      }

      if (!flag) {
        return;
      }
      // 将当前格子的背景色置为蓝色
      this.tableData[rowIndex][colIndex].class = 'bg-primary';
      // 将上一个选中的格子的背景色置绿色
      if (this.selectedTd.length > 0) {
        let lastTd = this.selectedTd[this.selectedTd.length - 1];
        this.tableData[lastTd.rowIndex][lastTd.colIndex].class = 'bg-success';
      }

      // 记录当前选中的格子
      this.selectedTd.push({
        rowIndex: rowIndex,
        colIndex: colIndex,
      });
    },
    // 松开格子
    clickTdMouseUp: async function (rowIndex, colIndex) {
      // 判断是否可以消除
      await this.checkCanRemove();
      // 清空选中的格子
      for (let i = 0; i < this.selectedTd.length; i++) {
        this.tableData[this.selectedTd[i].rowIndex][this.selectedTd[i].colIndex].class = '';
      }
      this.selectedTd = [];
      this.addLog('-'.repeat(12));
    },
    // 判断是否可以消除
    checkCanRemove: async function () {
      // 如果选中的格子数量小于2，则不需要判断
      if (this.selectedTd.length < 2) {
        return;
      }
      // 判断是否可以消除
      let canRemove = true;
      // 获取第一个格子的表达式
      let firstText = this.tableData[this.selectedTd[0].rowIndex][this.selectedTd[0].colIndex].text;
      // 遍历选中的格子
      for (let i = 1; i < this.selectedTd.length; i++) {
        // 获取当前格子的表达式
        let currentText = this.tableData[this.selectedTd[i].rowIndex][this.selectedTd[i].colIndex].text;
        // 如果当前格子的表达式与第一个格子的表达式不相同，则不能消除
        // if (!(currentText == firstText)) {
          // 移除换行符
          currentText = currentText.replace(/\n/g, '');
          firstText = firstText.replace(/\n/g, '');
          if (!(eval(currentText) == eval(firstText))) {
            canRemove = false;
            this.addLog(currentText + ' != ' + firstText + '，不能消除！');
            break;
          }
          firstText = currentText;
        }
        // 如果可以消除，则消除
        if (canRemove) {
          // 记录日志
          // 拼合前面的表达式
          let text = [];
          for (let i = 0; i < this.selectedTd.length; i++) {
            text.push(this.tableData[this.selectedTd[i].rowIndex][this.selectedTd[i].colIndex].text);
          }
          let text2 = [];
          let firstExpr = text[0];
          for (let i = 1; i < text.length; i++) {
            text2.push(firstExpr + ' == ' + text[i]);
            firstExpr = text[i];
          }
          // 移除换行符
          text2 = text2.map((item) => {
            return item.replace(/\n/g, '');
          });
          this.addLog(text2.join('\n') + '\n消除成功！');
          // 计算得分
          let t_score = 1;
          // 遍历选中的格子
          for (let i = 0; i < this.selectedTd.length; i++) {
            // 获取当前格子的行号和列号
            let rowIndex = this.selectedTd[i].rowIndex;
            let colIndex = this.selectedTd[i].colIndex;
            // 将当前格子的表达式置为空
            this.tableData[rowIndex][colIndex].text = '';
            // 将当前格子的背景色置为空
            this.tableData[rowIndex][colIndex].class = '';

            // 计算得分
            t_score += i;
          }
          // 计算得分
          this.score += t_score;
          // 更新最高得分
          if (this.score > this.maxScore) {
            this.maxScore = this.score;
          }
          this.addLog('分数增加：' + t_score);
          // 将剩余的格子向下移动
          await this.moveDown();
          // 生成新的表达式
          this.generateNewText();
        }
      },
        // 将剩余的格子向下移动
      moveDown: async function () {
        // 遍历每一列
        for (let colIndex = 0; colIndex < 10; colIndex++) {
          // 倒序
          for (let rowIndex = 10 - 1; rowIndex >= 0; rowIndex--) {
            // 如果当前格子的表达式为空，则将当前格子上面的格子的表达式填充到当前格子
            if (this.tableData[rowIndex][colIndex].text == '') {
              // 延迟0.05秒
              await new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve();
                }, 50);
              });
              // 找到当前格子上面的第一个非空格子
              let flag = false;
              for (let i = rowIndex - 1; i >= 0; i--) {
                // 如果找到了非空格子，则将其表达式填充到当前格子
                if (this.tableData[i][colIndex].text != '') {
                  this.tableData[rowIndex][colIndex].text = this.tableData[i][colIndex].text;
                  this.tableData[rowIndex][colIndex].color = this.tableData[i][colIndex].color;
                  this.tableData[i][colIndex].text = '';
                  this.tableData[i][colIndex].color = '';
                  flag = true;
                  break;
                }
              }
              if (!flag) {
                let [text, color] = getRandomData(this);
                this.tableData[rowIndex][colIndex].text = text;
                this.tableData[rowIndex][colIndex].color = color;
              }
            }
          }

        }
      },
      // 生成新的表达式
      generateNewText() {
        // 遍历每一列
        for (let colIndex = 0; colIndex < 10; colIndex++) {
          // 获取当前列的空格子数量
          let emptyCount = 0;
          for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
            // 如果当前格子的表达式为空，则空格子数量加1
            if (this.tableData[rowIndex][colIndex].text == '') {
              emptyCount++;
            }
          }
          // 随机生成空格子数量个表达式
          for (let i = 0; i < emptyCount; i++) {
            // 随机生成表达式
            let [text, color] = getRandomData(this);
            // 随机生成空格子的位置
            let rowIndex = Math.floor(Math.random() * (10 - emptyCount));
            // 将表达式填充到空格子的位置
            this.tableData[rowIndex][colIndex].text = text;
            this.tableData[rowIndex][colIndex].color = color;
          }
        }
      },
      addLog(text) {
        this.log += text + '\n';
        // 滚动到底部
        this.$nextTick(() => {
          let log = document.getElementById('log');
          log.scrollTop = log.scrollHeight;
        });
      }
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
            @mousedown="clickTdMouseDown(rowIndex, colIndex)"
            @mouseup="clickTdMouseUp(rowIndex, colIndex)"
            @mousemove="clickTdMouseDown(rowIndex, colIndex)"
            @touchstart.prevent="clickTdMouseDown(rowIndex, colIndex)"
            @touchmove.prevent="clickTdMouseDown(rowIndex, colIndex)"
            @touchend.prevent="clickTdMouseUp(rowIndex, colIndex)" :x="rowIndex" :y="colIndex">
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
