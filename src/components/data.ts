import seedrandom from 'seedrandom'

const exprData = [
  'null', 'undefined', 'false', 'Boolean\n(false)', '[]', '[[]]', '""',
  'String\n("")', '0', 'Number\n(0)', '"0"', 'String\n("0")', '[0]',
  'true', 'Boolean\n(true)', '1', 'Number\n(1)', '"1"', 'String\n("1")',
  '[1]', '-1', 'Number\n(-1)', '"-1"', 'String\n("-1")', '[-1]'
];

const exprColor = exprData.map(getRandomColor)


// 生成低饱和度的浅彩色十六进制
// hue 0~360
// staturation 50%~100%
// lightness 80%~95%
function getRandomColor() {
  let hue = Math.floor(Math.random() * 360);
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
  let data = exprData[r];
  let color = exprColor[r];
  return [data, color];
}

export function setSeed(seed: string) {
  seedrandom(seed, { global: true})
}
