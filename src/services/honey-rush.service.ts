import { WILDS, ICONS_POSITION_INDEX, DIMENSION_ICON_GAME } from "@/utils/constants"
import { randomNumber, convertToArray, getChainWinEachDrop, markSlotWin, randomPosition } from "@/utils"
import { calculateMoney } from "@/utils/calculateMoney"
import { droneColony } from "@/events/honey-rush/drone"

// task 2: tính tiền
interface ResultEachDrop {
  arrayStart: string
  arrayEnd?: string
  arrayWin?: []
  arrayWinPosition: Array<Array<number>>
  informationSlotWin: Array<{ length: number, value: number, wild?: number, haveWild: boolean, money: number }>
  money?: number
  totalMoney?: number
  chainDropNew?: string
  totalSlotWinEachDrop: number
  event?: string
  totalSlotWin?: number
}

interface TypeEvents {
  point: number,
  isTrigger: boolean,
  type: string
}

export const spinGame = async (money: number) => {

  const arrayStart = "2,6,4,2,2,6,2,6,4,2,2,6,1,3,4,5,2,6,5,4,4,7,4,2,7,6,6,1,5,3,6,6,7,4,5,2,6"
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

  const result: ResultEachDrop[] = []
  startGame(arrayStart, result, money, ColonyEventCondition)
  return result
}

const startGame = (
  arrayStart: string,
  result: ResultEachDrop[],
  money: number,
  ColonyEventCondition: TypeEvents[],
  eventTrigger?: string
) => {
  result = createNewGame(arrayStart, result, money, eventTrigger)

  const totalChainWin = calculateTotalSlotWin(result)

  ColonyEventCondition.map((item, index) => {
    if (totalChainWin >= item.point && !item.isTrigger) {
      item.isTrigger = true
      const arrayNumber = result[result.length - 1].arrayEnd
      const amountSlotTriggerEvent = randomSlotForEventDrone(arrayNumber as string, item.point)
      const eventArrayTrigger = droneColony(arrayNumber as string, item.type, amountSlotTriggerEvent)
      return startGame(eventArrayTrigger, result, money, ColonyEventCondition, item.type)
    }
  })
}

const createNewGame = (arrayStart: string, result: ResultEachDrop[], money: number, eventTrigger?: string): ResultEachDrop[] => {
  const resultEachDrop: ResultEachDrop = {
    arrayStart,
    arrayWinPosition: [],
    totalSlotWinEachDrop: 0,
    event: eventTrigger,
    informationSlotWin: []
  }

  let arrayNumber = convertToArray(arrayStart)

  arrayNumber.forEach((value, index) => {
    if (value == -1) {
      return
    }

    const chainIndexWin = [index + 1]
    getChainWinEachDrop(arrayNumber, chainIndexWin, value, index + 1)

    if (chainIndexWin.length > 4) {
      resultEachDrop.arrayWinPosition.push(chainIndexWin)
      const resultCalculateWilds = calculateWilds(chainIndexWin, arrayNumber, money, value)
      resultEachDrop.informationSlotWin.push({
        length: chainIndexWin.length,
        value: value,
        wild: resultCalculateWilds.totalChainWinMoney,
        haveWild: resultCalculateWilds.haveWild,
        money: resultCalculateWilds.totalChainWinMoney
      })
      arrayNumber = markSlotWin(arrayNumber, chainIndexWin)
    }
  })

  resultEachDrop.arrayEnd = arrayNumber.join(",")

  if (resultEachDrop.arrayWinPosition.length > 0) {
    const positionsWild = searchPositionWild(arrayNumber)
    if (positionsWild.length > 0) {
      arrayNumber = movePositionWild(arrayNumber, positionsWild)
    }
    arrayNumber = removeSlotWin(arrayNumber)
    resultEachDrop.totalSlotWinEachDrop = calculateSlotWinEachDrop(resultEachDrop)
    resultEachDrop.totalSlotWin = calculateTotalSlotWin(result) + resultEachDrop.totalSlotWinEachDrop
    resultEachDrop.arrayEnd = arrayNumber.join(",")
    result.push(resultEachDrop)

    result[result.length - 1].totalMoney = calculateTotalMoneySpin(result)

    return createNewGame(arrayNumber.join(","), result, money)
  }

  resultEachDrop.totalSlotWin = calculateTotalSlotWin(result)
  result.push(resultEachDrop)
  result[result.length - 1].totalMoney = calculateTotalMoneySpin(result)
  return result
}

const removeSlotWin = (array: number[]) => {
  const array2D = convertStringToArray2D(array)
  return array2D.map((array) => {
    const arrayDifferenceMinusOne = array.filter(item => item !== -1 && !WILDS.includes(item))

    let index = 0
    return array.map((item) => {
      if (WILDS.includes(item)) {
        return item;
      } else {
        const value = arrayDifferenceMinusOne[index] ?? ICONS_POSITION_INDEX[randomNumber()]
        index += 1
        return value
      }
    })
  }).flat()
}

const convertStringToArray2D = (array: number[]): number[][] => {
  const lengths = [4, 5, 6, 7, 6, 5, 4]
  const array2D: number[][] = []
  let index = 0

  lengths.forEach(length => {
    array2D.push(array.slice(index, index + length))
    index += length
  })

  return array2D
}

const calculateSlotWinEachDrop = (resultEachDrop: ResultEachDrop) => {
  return resultEachDrop.arrayWinPosition.reduce((total, array) => {
    return total + array.length
  }, 0)
}

const calculateTotalSlotWin = (result: ResultEachDrop[]) => {
  return result.reduce((total, resultEachDrop) => {
    return total + resultEachDrop.totalSlotWinEachDrop
  }, 0)
}

const searchPositionWild = (array: number[]): { index: number, value: number }[] => {
  return array.reduce((acc, item, index) => {
    if (WILDS.includes(item)) {
      acc.push({
        index: index + 1,
        value: item,
      });
    }
    return acc;
  }, [] as { index: number, value: number }[])
}

const movePositionWild = (array: number[], positionsWild: { index: number, value: number }[]) => {
  const newArray = [...array]

  positionsWild.forEach(positionWild => {
    const { index, value } = positionWild
    const dimensionItem = DIMENSION_ICON_GAME[index - 1]

    const positionCanMove = dimensionItem.nextStep.filter(item => newArray[item - 1] == -1 && item != 19)
    if (positionCanMove.length > 0) {
      const positionMove = randomPosition(positionCanMove)
      newArray[positionMove - 1] = value
      newArray[index - 1] = -1
    }
  })

  return newArray
}

const countAmountSlotCanRandom = (array: number[]) => {
  return array.reduce((total, item) => {
    if (item != array[18] && !WILDS.includes(item)) {
      return total + 1
    }
    return total
  }, 0)
}


const randomSlotForEventDrone = (array: string, pointTrigger: number): number => {
  const amountSlotCanRandom = countAmountSlotCanRandom(convertToArray(array))
  switch (pointTrigger) {
    case 20:
    case 40:
    case 80:
      return 7
    case 160:
      return Math.floor(Math.random() * (amountSlotCanRandom - 20)) + 20
    default:
      return 0
  }
}


const calculateWilds = (chainIndexWin: number[], array: number[], money: number, value: number) => {
  let chainWinInformation = chainIndexWin.reduce((total, item) => {
    return WILDS.includes(array[item - 1]) ? total * array[item - 1] : total
  }, 1)

  chainWinInformation = chainWinInformation != 1 ? chainWinInformation / 100 : 1

  const haveWild = chainIndexWin.some(index => WILDS.includes(array[index - 1]))

  const totalChainWinMoney = calculateMoney(money, value, chainIndexWin.length) * chainWinInformation

  return {
    chainWinInformation,
    haveWild,
    totalChainWinMoney
  }
}

const calculateTotalMoneySpin = (result: ResultEachDrop[]) => {
  return result.reduce((total: any, resultEachDrop: ResultEachDrop) => {
    if (resultEachDrop.informationSlotWin.length > 0) {
      const totalMoney = resultEachDrop.informationSlotWin.reduce((total, item) => {
        return total + item.money
      }, 0)
      return total + totalMoney
    }
  }, 0)
}
