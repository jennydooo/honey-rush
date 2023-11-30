import express from 'express'
import {
  createGameHoneyRush,
} from '@/controllers/honey-rush.controller'

const router = express.Router()

router.get('/spin', createGameHoneyRush)

export default router
