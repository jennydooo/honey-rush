import {
  searchSlotRelateFollowFormula,
  randomNumber,
  initDataGame
} from "@/utils/index"

import {
  ICONS_POSITION_INDEX,
  WILDS
} from "@/utils/constants"

import {
  droneColony
} from "@/events/honey-rush/drone"

import { triggerEvent_Worker_Queen } from "@/events/honey-rush/queen-worker"


let dataResponse: any = {}

// contains all chain win in a array2D
let containChainSlotWin: any = []

//contains all chains win in a game
let containChainSlotWinAllPerOneGame: any[] = []

//position of drone
let positionDrone = []

interface TypeEvents {
  point: number,
  isTrigger: boolean,
  type: string
}

export const spinGame = async () => {
  containChainSlotWin = []
  containChainSlotWinAllPerOneGame = []
  positionDrone = []
  dataResponse = {}
  const array2D = initDataGame()
  console.log("=============================")
  // console.log('array2D', array2D)

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

  startGame(array2D, ColonyEventCondition)

  return dataResponse
}

const startGame = (array2D: any[][], ColonyEventCondition: TypeEvents[]) => {
  array2D = createNewGame(array2D)
  const totalChainWin = containChainSlotWinAllPerOneGame.reduce((total, item) => total + item.length, 0)
  ColonyEventCondition.map((item, index) => {
    if (totalChainWin >= item.point && !item.isTrigger) {
      item.isTrigger = true
      console.log(`Event Colony ${index + 1} triggered`)
      const eventArray2D = totalChainWin >= 160 && item.point == 160
        ? triggerEvent_Worker_Queen(array2D, 20)
        : droneColony(array2D)
      return startGame(eventArray2D, ColonyEventCondition)
    }
  })
}


// create new game
const createNewGame = (array2D: any[][]): any[][] => {
  const containerDataGame: any = {}
  containerDataGame.array2d_start = array2D
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

  containerDataGame.chain_win = containChainSlotWin

  if (containChainSlotWin.length > 0) {
    containChainSlotWinAllPerOneGame.push(...containChainSlotWin)
    containChainSlotWin = []
    positionDrone = searchPositionDrone(array2D)
    if (positionDrone.length > 0) {
      array2D = moveSlotDrone(array2D, positionDrone)
    }
    containerDataGame.array2d_move_wild = array2D
    array2D = reNewArray2D(array2D)
    containerDataGame.array2d_end = array2D
    dataResponse.dataResponse.push(containerDataGame)
    return createNewGame(array2D)
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

const moveSlotDrone = (array2D: any[][], positionDrone: any[]) => {
  for (const position of positionDrone) {
    const [index2D, index] = position.split(',').map(Number)
    const arrayDifferenceValue =
      searchSlotRelateFollowFormula(array2D, index2D, index).filter(item => {
        const [itemIndex2D, itemIndex, value] = item.split(',').map(Number)
        item.split(',')[2] == -1
        return value == -1 && !(itemIndex2D == 3 && itemIndex == 3)
      })

    if (arrayDifferenceValue.length == 0) return array2D

    const [index2DRandom, indexRandom] = arrayDifferenceValue[Math.floor(Math.random() * arrayDifferenceValue.length)].split(',').map(Number)

    array2D[index2DRandom][indexRandom] = array2D[index2D][index]
    array2D[index2D][index] = -1
  }

  return array2D
}


/*

data response

{
  array2d_start
  chain_win
  event_trigger
  array2d_move_wild
  array2d_end
}

*/

