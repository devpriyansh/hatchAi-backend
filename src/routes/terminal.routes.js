import express from 'express'

import {
    runCommandController,
    stopCommandController
} from '../controllers/terminal.controller.js'

const router = express.Router()

router.post('/run', runCommandController)

router.post('/stop', stopCommandController)

export default router