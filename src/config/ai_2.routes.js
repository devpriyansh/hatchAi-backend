import express from 'express'

import {
   chatController
} from '../controllers/ai_2.controller.js'

const router = express.Router()

router.post('/chat', chatController)

export default router