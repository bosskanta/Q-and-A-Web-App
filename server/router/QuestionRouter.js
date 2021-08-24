import express from 'express'
import { create, edit, list, listMyQuestion } from '../controller/QuestionController.js'

let questionRouter = express.Router()

// user router REST API
questionRouter.get('/:tag', list)
questionRouter.post('/my', listMyQuestion)
questionRouter.post('/create', create)
questionRouter.post('/edit', edit)

export default questionRouter;