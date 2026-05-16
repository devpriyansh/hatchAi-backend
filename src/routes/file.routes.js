import express from 'express'

import {
    getFilesController,
    readFileController,
    writeFileController,
    createFileController,
    deleteFileController,
    getFileContentController
} from '../controllers/file.controller.js'

const router = express.Router()

router.get('/', getFilesController)

router.get('/read', readFileController)

router.get('/content', getFileContentController)

router.post('/write', writeFileController)

router.post('/create', createFileController)

router.delete('/delete', deleteFileController)

export default router