import {
  searchSlotRelateFollowFormula,
  randomNumber,
  initDataGame
} from "@/utils/index"
import { calculateMoney } from '@/utils/calculateMoney'

import {
  ICONS_POSITION_INDEX,
  WILDS
} from "@/utils/constants"

import {
  droneColony
} from "@/events/honey-rush/drone"

import { triggerEvent_Worker_Queen } from "@/events/honey-rush/queen-worker"


let dataResponse: any = []

//contains all chains win in a game
let containChainSlotWinAllPerOneGame: any[] = []


interface TypeEvents {
  point: number,
  isTrigger: boolean,
  type: string
}

export const spinGame = async (money: number) => {
  containChainSlotWinAllPerOneGame = []
  const array2D = [
    [2, 6, 4, 2],
    [2, 6, 2, 6, 4],
    [2, 2, 6, 1, 3, 4],
    [
      5, 2, 6, 5,
      4, 4, 7
    ],
    [4, 2, 7, 6, 6, 1],
    [5, 3, 6, 6, 7],
    [4, 5, 2, 6]
  ]

  const ColonyEventCondition = [
    {
      point: 20,
      isTrigger: false,
      type: 'drone'
    },
    {
      point: 40,
      isTrigger: false,
      type: 'drone'
    },
    {
      point: 80,
      isTrigger: false,
      type: 'drone'
    },
    {
      point: 160,
      isTrigger: false,
      type: 'queen'
    }
  ]

  dataResponse = []

  await startGame(array2D, ColonyEventCondition, money)

  return dataResponse
}

const startGame = (array2D: any[][], ColonyEventCondition: TypeEvents[], money: number, triggeredEvent?: string) => {
  array2D = createNewGame(array2D, money, triggeredEvent)
  const totalChainWin = containChainSlotWinAllPerOneGame.reduce((total, item) => total + item.length, 0)
  ColonyEventCondition.map((item, index) => {
    if (totalChainWin >= item.point && !item.isTrigger) {
      item.isTrigger = true
      console.log(`Event Colony ${index + 1} triggered`)
      let eventArray2D
      let nameEvent
      if (totalChainWin >= 160 && item.point == 160) {
        eventArray2D = triggerEvent_Worker_Queen(array2D, 20)
        nameEvent = 'queen'
      } else {
        eventArray2D = droneColony(array2D)
        nameEvent = 'drone'
      }
      return startGame(eventArray2D, ColonyEventCondition, money, nameEvent)
    }
  })
}


// create new game
const createNewGame = (array2D: any[][], moneyPlay: number, nameEvent?: string): any[][] => {
  const containerDataGame: any = {
    array2d_start: [],
    event_trigger: '',
    chain_win: [],
    list_icon_drops: '',
    total_slot_win: [],
    array2d_move_wild: [],
    array2d_end: [],
    money_win: 0,
    total_money_win: 0
  }

  // contains all chain win in a array2D
  let containChainSlotWin: any = []

  if (nameEvent) {
    containerDataGame.event_trigger = nameEvent
  }

  containerDataGame.array2d_start = convertArray2DToString(array2D)
  for (let index2D = 0; index2D < array2D.length; index2D++) {
    for (let index = 0; index < array2D[index2D].length; index++) {
      const positionValue = array2D[index2D][index]
      if (positionValue != -1) {
        let container = new Set().add(`${index2D},${index},${positionValue}`)
        container = searchAllSlotAdjacentCurrentSlot(array2D, container, index2D, index)
        if (container && container.size >= 5) {
          containChainSlotWin.push([...container])
          array2D = replacePositionWin(array2D, [...container])
        }
      }
    }
  }
  if (containChainSlotWin.length > 0) {
    containerDataGame.chain_win = containChainSlotWin.map((item: any[], index: number) => {
      const type = Number(item[0].split(',')[2])
      const coefficient = calculateMultiplierMoney(item)
      const haveWild = checkChainWinHaveWild(item)
      const money = calculateMoney(moneyPlay, type, item.length) * coefficient
      return `index:${index} - length:${item.length} - type: ${type} - money:${money} - ${+ haveWild ? 'wild:' + coefficient : ''}`
    }).join(';')

    containerDataGame.list_icon_drops = containChainSlotWin.map((item: any[]) => {
      return item.map(position => searchPositionInArray2D(array2D, position)).join(',')
    }).join(',')

    containerDataGame.money_win =
      containerDataGame.chain_win.split(';').reduce((total: string, item: string) => {
        const value = Number(item.split('-')[3].split(':')[1])
        return total + value
      }, 0)

    containChainSlotWinAllPerOneGame.push(...containChainSlotWin)

    containerDataGame.total_slot_win = containChainSlotWinAllPerOneGame.reduce((total, item) => total + item.length, 0)

    containChainSlotWin = []
    const positionDrone = searchPositionDrone(array2D)
    if (positionDrone.length > 0) {
      const array2DAfterMove = moveSlotDrone(array2D, positionDrone)
      array2D = array2DAfterMove.array2D
      containerDataGame.array2d_move_wild = array2DAfterMove.positionDrone
    }

    array2D = reNewArray2D(array2D)

    containerDataGame.array2d_end = convertArray2DToString(array2D)

    containerDataGame.total_money_win = dataResponse.reduce((total: number, item: any) => total + item.money_win, containerDataGame.money_win)

    dataResponse.push(containerDataGame)

    return createNewGame(array2D, moneyPlay)
  }

  return array2D
}

// search slot relate follow formula
const searchAllSlotAdjacentCurrentSlot = (array2D: any[][], container: any, index2D: number, index: number) => {
  const [_, __, firstValue] = [...container][0].split(',').map(Number)
  const currentValue = array2D[index2D][index]

  const slots = searchSlotRelateFollowFormula(array2D, index2D, index).filter(item => {
    const [_, __, value] = item.split(',').map(Number)
    return WILDS.includes(value) || firstValue == value || currentValue === value
  });

  // không có trong container và phải có giá trị bằng giá trị đầu tiên trong container or là wild
  const slotsDifferenceContainer = [...new Set([...slots].filter(item => {
    const [_, __, value] = item.split(',').map(Number)
    return !container.has(item) && (
      currentValue == value ||
      WILDS.includes(value) ||
      firstValue == value
    )
  }))]

  if (slotsDifferenceContainer.length > 0) {
    for (const slot of slotsDifferenceContainer) {
      const [index2D, index, value] = slot.split(',').map(Number)
      container.add(`${index2D},${index},${value}`)
      searchAllSlotAdjacentCurrentSlot(array2D, container, index2D, index)
    }
  }

  return container
}

const replacePositionWin = (array2D: any[][], chainWin: any[]) => {
  chainWin.forEach(item => {
    const [index2D, index] = item.split(',').map(Number)
    if (!WILDS.includes(array2D[index2D][index]))
      array2D[index2D][index] = -1
  })

  return array2D
}

const reNewArray2D = (array2D: any[][]) => array2D.map(removeSlotWin)

const removeSlotWin = (array: any[]) => {
  const arrayDifferenceMinusOne = array.filter(item => item !== -1 && !WILDS.includes(item))
  let index = 0

  return array.map(item => {
    if (WILDS.includes(item)) {
      return item
    } else {
      const value = arrayDifferenceMinusOne[index] ?? ICONS_POSITION_INDEX[randomNumber()]
      index++
      return value
    }
  })
}

const searchPositionDrone = (array2D: any[][]) => {
  const positions = [];

  for (let i = 0; i < array2D.length; i++) {
    for (let j = 0; j < array2D[i].length; j++) {
      if (WILDS.includes(array2D[i][j])) {
        positions.push(`${i},${j}`);
      }
    }
  }

  return positions
}

const moveSlotDrone = (array2D: any[][], positionDrone: any[]): {
  array2D: any[][],
  positionDrone: string
} => {
  let arrayDronePosition = []
  for (const position of positionDrone) {
    const [index2D, index] = position.split(',').map(Number)
    const arrayDifferenceValue =
      searchSlotRelateFollowFormula(array2D, index2D, index).filter(item => {
        const [itemIndex2D, itemIndex, value] = item.split(',').map(Number)
        item.split(',')[2] == -1
        return value == -1 && !(itemIndex2D == 3 && itemIndex == 3)
      })

    if (arrayDifferenceValue.length == 0) continue

    const [index2DRandom, indexRandom] = arrayDifferenceValue[Math.floor(Math.random() * arrayDifferenceValue.length)].split(',').map(Number)

    array2D[index2DRandom][indexRandom] = array2D[index2D][index]
    array2D[index2D][index] = -1

    const oldPosition = searchPositionInArray2D(array2D, `${index2D},${index}`)
    const newPosition = searchPositionInArray2D(array2D, `${index2DRandom},${indexRandom}`)

    arrayDronePosition.push(`${array2D[index2DRandom][indexRandom]}-${oldPosition},${newPosition}`)
  }

  return {
    array2D,
    positionDrone: arrayDronePosition.join(';')
  }
}

const convertArray2DToString = (array2D: any[][]): string => {
  return array2D.map(subArray => subArray.join(',')).join(',');
}


const searchPositionInArray2D = (array2D: any[][], position: string): number => {
  const [index2D, index] = position.split(',').map(Number)
  let count = 0

  for (let i = 0; i < array2D.length; i++) {
    for (let j = 0; j < array2D[i].length; j++) {
      count++
      if (j === index && index2D === i) return count
    }
  }

  return count
}

const calculateMultiplierMoney = (chainWin: any[]): number => {
  const coefficient = chainWin.filter(item => {
    const value = Number(item.split(',')[2])
    if (WILDS.includes(value)) return true
    return false
  })

  if (coefficient.length > 0) {
    return coefficient.reduce((total, item) => {
      return total * Number(item.split(',')[2]) / 100
    }, 1)
  }

  return 1
}

const checkChainWinHaveWild = (chainWin: any[]): boolean => {
  return chainWin.some(item => {
    const value = Number(item.split(',')[2])
    if (WILDS.includes(value)) return true
    return false
  })
}
