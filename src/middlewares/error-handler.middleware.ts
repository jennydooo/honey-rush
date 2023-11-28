import { NextFunction, Request, Response } from 'express'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(123)
  console.error(err)
  res.status(500).send({ errors: [{ message: 'Something went wrong' }] })
}
