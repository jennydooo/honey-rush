import { WILDS, ICONS_POSITION_INDEX } from "@/utils/constants"
import { randomNumber, convertToArray, getChainWinEachDrop, markSlotWin } from "@/utils"
import { droneColony } from "@/events/honey-rush/drone"
interface ResultEachDrop {
  arrayStart: string
  arrayEnd?: string
  arrayWin?: []
  arrayWinPosition: Array<Array<number>>
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

  const arrayStart = "6,4,2,4,6,2,6,4,5,6,1,3,4,3,5,5,6,5,4,4,7,4,4,7,1,4,7,4,5,3,7,7,3,4,5,2,0"

  const arrayDrone = droneColony(arrayStart, 25)

  console.log(arrayDrone)

  return arrayDrone

  // const ColonyEventCondition = [
  //   {
  //     point: 20,
  //     isTrigger: false,
  //     type: 'drone'
  //   },
  //   {
  //     point: 40,
  //     isTrigger: false,
  //     type: 'drone'
  //   },
  //   {
  //     point: 80,
  //     isTrigger: false,
  //     type: 'drone'
  //   },
  //   {
  //     point: 160,
  //     isTrigger: false,
  //     type: 'queen'
  //   }
  // ]

  // const result: ResultEachDrop[] = []
  // startGame(arrayStart, result, money, ColonyEventCondition)

  // return result
}

const startGame = (
  arrayStart: string,
  result: ResultEachDrop[],
  money: number,
  ColonyEventCondition: TypeEvents[]
) => {
  createNewGame(arrayStart, result, money)

  const totalChainWin = calculateTotalSlotWin(result)

  console.log(totalChainWin)

  ColonyEventCondition.map((item, index) => {
    if (totalChainWin >= item.point && !item.isTrigger) {
      item.isTrigger = true
      // console.log(`Event Colony ${index + 1} triggered`)
      // const eventArray2D = totalChainWin >= 160 && item.point == 160
      //   ? triggerEvent_Worker_Queen(array2D, 20)
      //   : droneColony(array2D)
      // return startGame(eventArray2D, ColonyEventCondition)
    }
  })
}

const createNewGame = (arrayStart: string, result: ResultEachDrop[], money: number): ResultEachDrop[] => {
  const resultEachDrop: ResultEachDrop = {
    arrayStart,
    arrayWinPosition: [],
    totalSlotWinEachDrop: 0
  }

  let arrayNumber = convertToArray(arrayStart)

  arrayNumber.forEach((value, index) => {
    if (value == -1) {
      return
    }

    const chainIndexWin = [index + 1]
    getChainWinEachDrop(arrayNumber, chainIndexWin, value, index + 1)

    if (chainIndexWin.length > 4) {
      arrayNumber = markSlotWin(arrayNumber, chainIndexWin)
      resultEachDrop.arrayWinPosition.push(chainIndexWin)
    }
  })

  if (resultEachDrop.arrayWinPosition.length > 0) {

    arrayNumber = removeSlotWin(arrayNumber)
    const totalSlotWinEachDrop = calculateSlotWinEachDrop(resultEachDrop)
    resultEachDrop.totalSlotWinEachDrop = totalSlotWinEachDrop
    const totalSlotWin = calculateTotalSlotWin(result)
    resultEachDrop.totalSlotWin = totalSlotWin + totalSlotWinEachDrop
    resultEachDrop.arrayEnd = arrayNumber.join(",")
    result.push(resultEachDrop)

    return createNewGame(arrayNumber.join(","), result, money)
  }

  return result
}

const removeSlotWin = (array: number[]) => {
  const array2D = convertStringToArray2D(array)
  return array2D.map((array) => {
    const arrayDifferenceMinusOne = array.filter(item => item !== -1 && !WILDS.includes(item))

    return array.map((item, index) => {
      if (WILDS.includes(item)) {
        return item;
      } else {
        return arrayDifferenceMinusOne[index] ?? ICONS_POSITION_INDEX[randomNumber()]
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
