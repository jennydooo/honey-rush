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

export const calculateMoney = (money: number, type: number, number: number): number => {
    switch (type) {
        case 0:
            return calculateMoneyDiamond(money, number)
        case 1:
            return calculateMoneyGood(money, number)
        case 2:
            return calculateMoneySliver(money, number)
        case 3:
            return calculateMoneyCopper(money, number)
        case 4:
        case 5:
        case 6:
        case 7:
            return calculateMoneyFollower(money, number)
        default:
            return 0
    }
}

const calculateMoneyFollower = (money: number, number: number): number => {
    if (number === 0) return 0
    else if (number === 5) return money * 0.1
    else if (number === 6) return money * 0.15
    else if (number === 7) return money * 0.2
    else if (number === 8) return money * 0.25
    else if (number === 9) return money * 0.3
    else if (number === 10) return money * 0.4
    else if (number === 11) return money * 0.5
    else if (number === 12) return money * 0.6
    else if (number === 13) return money * 0.8
    else if (number === 14) return money * 1
    else if (number >= 15 && number < 20) return money * 3
    else if (number >= 20 && number < 25) return money * 4
    else if (number >= 25 && number < 30) return money * 7.5
    else if (number >= 30 && number < 55) return money * 10
    else if (number >= 35) return money * 20

    return 0
}

const calculateMoneyDiamond = (money: number, number: number): number => {
    if (number === 0) return 0
    else if (number === 5) return money * 1
    else if (number === 6) return money * 1.5
    else if (number === 7) return money * 2
    else if (number === 8) return money * 2.5
    else if (number === 9) return money * 3
    else if (number === 10) return money * 4
    else if (number === 11) return money * 5
    else if (number === 12) return money * 6
    else if (number === 13) return money * 8
    else if (number === 14) return money * 10
    else if (number >= 15 && number < 20) return money * 15
    else if (number >= 20 && number < 25) return money * 40
    else if (number >= 25 && number < 30) return money * 50
    else if (number >= 30 && number < 55) return money * 100
    else if (number >= 35) return money * 200

    return 0
}

const calculateMoneyGood = (money: number, number: number): number => {
    if (number === 0) return 0
    else if (number === 5) return money * 0.5
    else if (number === 6) return money * 0.75
    else if (number === 7) return money * 1
    else if (number === 8) return money * 1.25
    else if (number === 9) return money * 1.5
    else if (number === 10) return money * 2
    else if (number === 11) return money * 2.5
    else if (number === 12) return money * 3
    else if (number === 13) return money * 4
    else if (number === 14) return money * 5
    else if (number >= 15 && number < 20) return money * 7.5
    else if (number >= 20 && number < 25) return money * 20
    else if (number >= 25 && number < 30) return money * 30
    else if (number >= 30 && number < 55) return money * 50
    else if (number >= 35) return money * 100

    return 0
}

const calculateMoneySliver = (money: number, number: number): number => {
    if (number === 0) return 0
    else if (number === 5) return money * 0.4
    else if (number === 6) return money * 0.6
    else if (number === 7) return money * 0.8
    else if (number === 8) return money * 1
    else if (number === 9) return money * 1.25
    else if (number === 10) return money * 1.5
    else if (number === 11) return money * 2
    else if (number === 12) return money * 2.5
    else if (number === 13) return money * 3
    else if (number === 14) return money * 4
    else if (number >= 15 && number < 20) return money * 6
    else if (number >= 20 && number < 25) return money * 15
    else if (number >= 25 && number < 30) return money * 25
    else if (number >= 30 && number < 55) return money * 40
    else if (number >= 35) return money * 75

    return 0
}

const calculateMoneyCopper = (money: number, number: number): number => {
    if (number === 0) return 0
    else if (number === 5) return money * 0.3
    else if (number === 6) return money * 0.4
    else if (number === 7) return money * 0.6
    else if (number === 8) return money * 0.8
    else if (number === 9) return money * 1
    else if (number === 10) return money * 1.25
    else if (number === 11) return money * 1.5
    else if (number === 12) return money * 2
    else if (number === 13) return money * 2.5
    else if (number === 14) return money * 3
    else if (number >= 15 && number < 20) return money * 5
    else if (number >= 20 && number < 25) return money * 10
    else if (number >= 25 && number < 30) return money * 20
    else if (number >= 30 && number < 55) return money * 30
    else if (number >= 35) return money * 50

    return 0
}

