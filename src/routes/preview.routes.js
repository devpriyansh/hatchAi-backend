import express from 'express'

import {
    startPreviewController,
    getPreviewController
} from '../controllers/preview.controller.js'

const router = express.Router()

router.post('/start', startPreviewController)

router.get('/', getPreviewController)

export default router