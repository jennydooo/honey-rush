import { NextFunction, Request, Response } from 'express'
import { spinGame } from '@/services/honey-rush.service'

export const createGameHoneyRush = async (req: Request, res: Response, next: NextFunction) => {
  const { money } = req.query

  const dataGame = await spinGame(Number(money) || 2)

  return dataGame ? res.send(dataGame) : res.status(400).send({ message: 'Create resource fail !' })
}
