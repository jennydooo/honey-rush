import express from 'express'
import {
  createGameHoneyRush,
} from '@/controllers/honey-rush.controller'

const router = express.Router()

router.post('/create', createGameHoneyRush)

export default router
