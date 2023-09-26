import seedrandom from 'seedrandom'

// text: [valFunc, hue]
const exprData = {
  // keyword
  'null': [() => null, 0],
  'undefined': [() => undefined, 0],
  'false': [() => false, 0],
  'true': [() => true, 0],
  // string
  '""': [() => "", 50],
  '"0"': [() => "0", 50],
  '"1"': [() => "1", 50],
  '"-1"': [() => "-1", 50],
  // number
  '-1': [() => -1, 100],
  '0': [() => 0, 100],
  '1': [() => 1, 100],
  // Boolean
  'Boolean(false)': [() => Boolean(false), 150],
  'Boolean(true)': [() => Boolean(true), 150],
  // Number
  'Number(-1)': [() => Number(-1), 200],
  'Number(0)': [() => Number(0), 200],
  'Number(1)': [() => Number(1), 200],
  // String
  'String("")': [() => String(""), 250],
  'String("-1")': [() => String("-1"), 250],
  'String("0")': [() => String("0"), 250],
  'String("1")': [() => String("1"), 250],
  // Array
  '[-1]': [() => [-1], 300],
  '[0]': [() => [0], 300],
  '[1]': [() => [1], 300],
  '[[]]': [() => [[]], 300],
  '[]': [ () => [], 300],
} as const;

const colorData = Object.entries(exprData)
  .map(([text, v]) => [text.replace(/\(/, '\n('), getRandomColor(v[1])])

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

export function getRandomData() {
  let r = Math.floor(Math.random() * colorData.length);
  return colorData[r];
}

export function setSeed(seed: string) {
  seedrandom(seed, { global: true})
}

export function isEqual(t1: string, t2: string) {
  // @ts-expect-error
  return exprData[t1][0]() == exprData[t2][0]()
}
