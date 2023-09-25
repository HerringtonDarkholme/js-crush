import seedrandom from 'seedrandom'

// [text, hue]
const exprData = [
  // keyword
  ['null', 0],
  ['undefined', 0],
  ['false', 0],
  ['true', 0],
  // string
  ['""', 60],
  ['"0"', 60],
  ['"1"', 60],
  ['"-1"', 60],
  // number
  ['-1', 120],
  ['0', 120],
  ['1', 120],
  // Boolean
  ['Boolean\n(false)', 180],
  ['Boolean\n(true)', 180],
  // Number
  ['Number\n(-1)', 240],
  ['Number\n(0)', 240],
  ['Number\n(1)', 240],
  // String
  ['String\n("")', 300],
  ['String\n("-1")', 300],
  ['String\n("0")', 300],
  ['String\n("1")', 300],
  // Array
  ['[-1]', 360],
  ['[0]', 360],
  ['[1]', 360],
  ['[[]]', 360],
  ['[]', 360],
] as const;

const colorData = exprData.map(([text, hue]) => [text, getRandomColor(hue)])

// 生成低饱和度的浅彩色十六进制
// hue 0~360
// staturation 50%~100%
// lightness 80%~95%
function getRandomColor(hue: number) {
  hue += Math.floor((Math.random() - 0.5) * 30)
  let saturation = percentage(Math.random() * 0.5 + 0.5);
  let lightness = percentage(Math.random() * 0.15 + 0.8);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function percentage(n: number) {
  return Math.floor(n * 100)
}

// 获取随机的表达式和颜色
export function getRandomData() {
  let r = Math.floor(Math.random() * exprData.length);
  return colorData[r];
}

export function setSeed(seed: string) {
  seedrandom(seed, { global: true})
}
