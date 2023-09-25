// global logs store
// TODO: add plenty of witty phrases here
import { ref } from 'vue'
import { chunkTwo } from './utils'

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

export function resetLog(seed: string) {
  logs.value = [`Game Seed: ${seed}`];
}
