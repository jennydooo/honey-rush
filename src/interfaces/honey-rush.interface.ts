import { Document } from 'mongoose'

export interface Resource extends Document {
  name: string
  email: string
  gender: string
  age: number
}
