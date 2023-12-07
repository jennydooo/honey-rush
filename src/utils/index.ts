import { DIMENSION_ICON_GAME, WILDS } from "./constants"

export const randomNumber = () => Math.floor(Math.random() * 26)

export const convertToArray = (array: string): number[] => {
    return array.split(",").map(item => Number(item))
}

export const getChainWinEachDrop = (arrayNumber: number[], chainIndexWin: number[], value: number, index: number) => {
    const dimensionItem = DIMENSION_ICON_GAME.find(item => item.id === index)
    const nextStep = dimensionItem?.nextStep as number[]

    // các bước tiếp theo có thể đi được
    const stepCanMoveAndHaveSameValue = getStepCanMoveAndHaveSameValue(arrayNumber, nextStep, chainIndexWin, value)
    if (stepCanMoveAndHaveSameValue.length === 0) {
        return chainIndexWin
    }

    stepCanMoveAndHaveSameValue.forEach(step => {
        if (!chainIndexWin.includes(step)) chainIndexWin.push(step)
        return getChainWinEachDrop(arrayNumber, chainIndexWin, value, step)
    })
}

const getStepCanMoveAndHaveSameValue = (arrayNumber: number[], nextStep: number[], chainIndexWin: number[], value: number) => {
    return nextStep
        .filter(step => (arrayNumber[step - 1] === value || WILDS.includes(arrayNumber[step - 1])) && !chainIndexWin.includes(step))
}

export const markSlotWin = (arrayNumber: number[], chainIndexWin: number[]) => {
    chainIndexWin.forEach(index => {
        if (!WILDS.includes(arrayNumber[index - 1]))
            arrayNumber[index - 1] = -1
    })

    return arrayNumber
}

export const randomPosition = (array: number[]): number => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}
