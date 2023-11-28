import {
    searchSlotRelateFollowFormula,
    changeIntoCenterValue
} from "@/utils/index"
import {
    WILDS
} from "@/utils/constants"

export const droneColony = (array2D: any[][]) => {
    const index = 3 // center position
    const index2D = 3 // center position
    const centerValue = array2D[index2D][index]
    const arrAdjacentWithCenterPosition = searchSlotRelateFollowFormula(array2D, index2D, index)
    const array2DAfterChange = changeIntoCenterValue(array2D, arrAdjacentWithCenterPosition, centerValue)
    return randomPositionWild(array2DAfterChange, arrAdjacentWithCenterPosition, centerValue)
}


const randomPositionWild = (array2D: any[][], positionRelative: any[], centerValue: number): any[][] => {
    const random = positionRelative[Math.floor(Math.random() * 6)]
    const [index2D, index] = random.split(',').map(Number)
    const arrayDifferenceValue = searchSlotRelateFollowFormula(array2D, index2D, index).filter(item => {
        const [_, __, value] = item.split(',').map(Number)
        return array2D[index2D][index] != value
    })
    while (arrayDifferenceValue.length == 0) {
        return randomPositionWild(array2D, positionRelative, centerValue)
    }
    const [index2DRandom, indexRandom] = arrayDifferenceValue[Math.floor(Math.random() * arrayDifferenceValue.length)].split(',').map(Number)
    const randomValue = array2D[index2DRandom][indexRandom]

    if (randomValue == centerValue || WILDS.includes(randomValue)) {
        return randomPositionWild(array2D, positionRelative, centerValue)
    }

    array2D[index2DRandom][indexRandom] = WILDS[Math.floor(Math.random() * WILDS.length)]

    return array2D
}
