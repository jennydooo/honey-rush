import { Schema, model } from 'mongoose'

import { Resource } from '../interfaces/honey-rush.interface'

export const HoneyRushSchema = new Schema(
  {
    playerId: { type: String, required: true },
    dataGame: { type: Object, required: true },
  },
  { versionKey: false }
)

const Resource = model<Resource>('HoneyRushGame', HoneyRushSchema)

export default Resource


/*



*/
