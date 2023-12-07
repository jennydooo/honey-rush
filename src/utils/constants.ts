// const ICONS_NAME = {
//     diamond: 0,
//     good: 1,
//     sliver: 2,
//     copper: 3,
//     red: 4,
//     pink: 5,
//     purple: 6,
//     yellow: 7
// }

export const ICONS_POSITION_INDEX = [
    0,
    1,
    1,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    5,
    6,
    7,
    4,
    5,
    6,
    7,
    4,
    5,
    6,
    7,
    4,
    5,
    6,
    7,
]

export const WILDS = [100, 200, 300]

export const sizeReward = {
    done: {
        from: 7,
        to: 7
    },
    worker: {
        from: 7,
        to: 15,
    },
    queen: {
        from: 20,
        to: 37
    }
}


export const lengthSubsArray = [4, 5, 6, 7, 6, 5, 4]


export const DIMENSION_ICON_GAME = [
    {
        id: 1,
        nextStep: [2, 5, 6]
    },
    {
        id: 2,
        nextStep: [3, 7, 6, 1]
    },
    {
        id: 3,
        nextStep: [4, 8, 7, 2]
    },
    {
        id: 4,
        nextStep: [9, 8, 3]
    },
    {
        id: 5,
        nextStep: [1, 6, 10, 11]
    },
    {
        id: 6,
        nextStep: [7, 12, 11, 5, 1, 2]
    },
    {
        id: 7,
        nextStep: [8, 13, 12, 6, 2, 3]
    },
    {
        id: 8,
        nextStep: [9, 14, 13, 7, 3, 4]
    },
    {
        id: 9,
        nextStep: [15, 14, 8, 4]
    },
    {
        id: 10,
        nextStep: [11, 17, 16, 5]
    },
    {
        id: 11,
        nextStep: [12, 18, 17, 10, 5, 6]
    },
    {
        id: 12,
        nextStep: [13, 19, 18, 11, 6, 7]
    },
    {
        id: 13,
        nextStep: [14, 20, 19, 12, 7, 8]
    },
    {
        id: 14,
        nextStep: [15, 21, 20, 13, 8, 9]
    },
    {
        id: 15,
        nextStep: [22, 21, 14, 9]
    },
    {
        id: 16,
        nextStep: [17, 23, 10]
    },
    {
        id: 17,
        nextStep: [18, 24, 23, 16, 10, 11]
    },
    {
        id: 18,
        nextStep: [19, 25, 24, 17, 11, 12]
    },
    {
        id: 19,
        nextStep: [20, 26, 25, 18, 12, 13]
    },
    {
        id: 20,
        nextStep: [21, 27, 26, 19, 13, 14]
    },
    {
        id: 21,
        nextStep: [22, 28, 27, 20, 14, 15]
    },
    {
        id: 22,
        nextStep: [28, 21, 15]
    },
    {
        id: 23,
        nextStep: [24, 29, 16, 17]
    },
    {
        id: 24,
        nextStep: [25, 30, 29, 23, 17, 18]
    },
    {
        id: 25,
        nextStep: [26, 31, 30, 24, 18, 19]
    },
    {
        id: 26,
        nextStep: [27, 32, 31, 25, 19, 20]
    },
    {
        id: 27,
        nextStep: [28, 33, 32, 26, 20, 21]
    },
    {
        id: 28,
        nextStep: [33, 27, 21, 22]
    },
    {
        id: 29,
        nextStep: [30, 34, 23, 24]
    },
    {
        id: 30,
        nextStep: [31, 35, 34, 29, 24, 25]
    },
    {
        id: 31,
        nextStep: [32, 36, 35, 30, 25, 26]
    },
    {
        id: 32,
        nextStep: [33, 37, 36, 31, 26, 27]
    },
    {
        id: 33,
        nextStep: [37, 32, 27, 28]
    },
    {
        id: 34,
        nextStep: [35, 29, 30]
    },
    {
        id: 35,
        nextStep: [36, 31, 30, 34]
    },
    {
        id: 36,
        nextStep: [37, 32, 31, 35]
    },
    {
        id: 37,
        nextStep: [33, 32, 36]
    },
]



