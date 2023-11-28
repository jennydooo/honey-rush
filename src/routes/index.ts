import express from 'express'
import honeyRush from './honey-rush'

export const router = express.Router()

router.use('/v1/honey-rush', honeyRush)
