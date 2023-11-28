import { validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'

export const validateBody = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    throw new Error('Validate Fail !!')
  }

  next()
}
