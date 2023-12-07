import { convertToArray, getChainWinEachDrop, randomPosition } from "@/utils"
import { WILDS, ICONS_POSITION_INDEX, DIMENSION_ICON_GAME } from "@/utils/constants"

export const droneColony = (array: string, type: string, numberRandomEvent: number) => {
    let arrayNumber = convertToArray(array)
    const indexCenter = 19
    const valueCenter = arrayNumber[indexCenter - 1]
    // tìm những vị trí ở trung tâm có giá trị khác với wild và giá trị trung tâm
    const dimensionItemCenterNextStep = DIMENSION_ICON_GAME[indexCenter - 1].nextStep.filter((item) => {
        return !WILDS.includes(arrayNumber[item - 1]) && arrayNumber[item - 1] != valueCenter
    })

    dimensionItemCenterNextStep.forEach((item, index) => {
        arrayNumber[item - 1] = valueCenter
    })


    numberRandomEvent = numberRandomEvent - dimensionItemCenterNextStep.length

    if (numberRandomEvent > 0) {
        arrayNumber = randomPositionCanCreateChainWinWhenTriggerEvent(arrayNumber, numberRandomEvent, valueCenter)
    }

    if (type === 'drone') {
        const wildPosition = randomPositionCanCreateChainWin(arrayNumber)
        arrayNumber[wildPosition - 1] = randomPosition(WILDS)
    }
    return arrayNumber.join(",")

}
// random các vị trí còn lại có thể tạo thành chuỗi win khi trigger event drone, queen, worker
const randomPositionCanCreateChainWinWhenTriggerEvent = (
    arrayNumber: number[],
    numberRandomEvent: number,
    valueCenter: number
): number[] => {
    const positionRandom = randomPositionCanCreateChainWin(arrayNumber)
    arrayNumber[positionRandom - 1] = valueCenter
    numberRandomEvent = numberRandomEvent - 1

    if (numberRandomEvent > 0) {
        return randomPositionCanCreateChainWinWhenTriggerEvent(arrayNumber, numberRandomEvent, valueCenter)
    }

    return arrayNumber
}

// random vị trí có giá trị khác với vị trí trung tâm và có thể liên kết để tạo thành chuỗi win
const randomPositionCanCreateChainWin = (arrayNumber: number[]): number => {
    let chainIndexWin: number[] = []

    for (let index = 1; index <= arrayNumber.length; index++) {
        chainIndexWin = [index]
        const value = arrayNumber[index - 1]
        getChainWinEachDrop(arrayNumber, chainIndexWin, value, index)

        if (chainIndexWin.length > 4) {
            break
        }
    }

    // random vị trí ngẫu nhiên có value giống với vị trí trung tâm
    let stepDimension
    do {
        const positionRadomRelateCenter = randomPosition(chainIndexWin)
        stepDimension = DIMENSION_ICON_GAME[positionRadomRelateCenter - 1].nextStep
        stepDimension = stepDimension.filter((item) => {
            return !chainIndexWin.includes(item)
        })
    } while (stepDimension.length == 0)

    return randomPosition(stepDimension)
}

