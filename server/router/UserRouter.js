import express from 'express'
import { jwtPassport } from '../util/jwt-passport.js'
import { create, checkSignin, validateToken } from '../controller/UserController.js'

let userRouter = express.Router()
let auth = jwtPassport()
//userRoute.use(auth.initialize());

// user router REST API
userRouter.post('/signup', create)
userRouter.post('/signin', checkSignin)
userRouter.post('/validateToken', validateToken)

export default userRouter;