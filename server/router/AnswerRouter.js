import express from 'express'
import { create, listMyAnswer, edit, upvote, downvote } from '../controller/AnswerController.js'

let answerRouter = express.Router()

// user router REST API
answerRouter.post('/create', create)
answerRouter.post('/edit', edit)
answerRouter.post('/my', listMyAnswer)
answerRouter.post('/upvote', upvote)
answerRouter.post('/downvote', downvote)

export default answerRouter;