// global logs store
// TODO: add plenty of witty phrases here
import { ref, computed } from 'vue'
import { chunkTwo } from './utils'
import { getRandomData } from './data'

export interface Tile {
  text: string,
  class: string,
  color: string,
}

export let tableData = ref([] as Tile[][])
export const SIZE = 8;
function initTableData() {
  const data: Tile[][] = [];
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
    data.push(row);
  }
  tableData.value = data
}

interface NoCrush {
  type: 'NoCrush'
  currentText: string
  prevText: string
}
interface Crushed {
  type: 'Crushed'
  selectedText: string[]
  turnScore: number
}

interface Promotion {
  type: 'Promotion'
  from: string
  to: string
}

type Log =
  | NoCrush
  | Crushed
  | Promotion

export const logs = ref([] as string[])

export function addLog(log: Log) {
  let logStr = ''
  switch (log.type) {
    case 'NoCrush': {
      logStr = `${log.prevText} != ${log.currentText}\nNo Crush...`
      break
    }
    case 'Crushed': {
      const text = [...chunkTwo(log.selectedText)]
        .map(([prev, curr]) => `* ${prev} == ${curr}`)
        .join('\n')

      logStr = text + '\nCrushed!! ' + `Score +${log.turnScore}`
      break
    }
    case 'Promotion': {
      logStr = `Congratulation! You have been promoted \nfrom ${log.from} \nto ${log.to} `
      break
    }
  }
  logs.value.push(logStr)
}

export function startNewGame(seed: string) {
  initTableData()
  logs.value = [`Game Seed: ${seed}`]
}

export let score = ref(0)
export function addScore(selectedText: string[]): number {
  let len = selectedText.length;
  let turnScore = 10 + (len - 1) * len / 2 * 10
  addLog({
    type: 'Crushed',
    selectedText,
    turnScore,
  })
  score.value += turnScore
  return turnScore
}

const titles = [
  [0, 'JavaScript Learner', 'Know how to `console.log("hello world")`? Congrats!'],
  [100, 'JavaScript Intern', 'console.log and alert are your best friend.'],
  [250, 'Junior Engineer', 'Functions and Loops are Bread and Butter.'],
  [500, 'Senior Engineer', 'You mastered frameworks and libraries!? What about == equality?'],
  [1000, 'Staff Engineer', 'You, a leader, a mentor and a semicolon judge.'],
  [2000, 'Principal Engineer', 'Build visionary JS app and JS meme.'],
  [5000, 'JavaScript CTO', 'You are the boss of JavaScript!'],
  [10000, 'Douglas Crockford', 'You are the legend of JavaScript! The game is a tribute to JS the good part.'],
  [39262, 'TC39 Member', 'The future (rule) of this game is in your hand.'],
  [50000, 'Brendan Eich', 'My Lord, you invented the language in 10 days.'],
] as const

export let title = computed(() => {
  let left = 0
  let right = titles.length - 1
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2)
    if (titles[mid][0] < score.value) {
      left = mid + 1
    } else {
      right = mid
    }
  }
  if (score.value < titles[left][0]) {
    console.assert(left > 0)
    return titles[left - 1]
  } else {
    return titles[left]
  }
})
