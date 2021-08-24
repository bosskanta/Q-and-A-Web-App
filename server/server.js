import express from 'express'
import path from 'path'
import mongooseDbConnect from './config/database.js'
import Tag from './model/Tag.js'
import { default as userRouter } from './router/UserRouter.js'
import { default as questionRouter } from './router/QuestionRouter.js'
import { default as answerRouter } from './router/AnswerRouter.js'
import { getQuestion } from './controller/QuestionController.js'

const port = 4000;

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).json({ error: err });
}

var app = express()

app.use('/public', express.static(path.join(process.cwd(), "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(errorHandler)

mongooseDbConnect()

var gameTag = new Tag({
    name: "Games"
})
gameTag.save(function (err, example) {
    if (!err) console.log("Create new tag");
});

var movieTag = new Tag({
    name: "Movies"
})
movieTag.save(function (err, example) {
    if (!err) console.log("Create new tag");
});

var foodTag = new Tag({
    name: "Foods"
})
foodTag.save(function (err, example) {
    if (!err) console.log("Create new tag");
});

// REST
app.use('/user', userRouter)
app.use('/question', questionRouter)
app.use('/answer', answerRouter)

app.get('/get/:questionId', getQuestion)

app.get('/', (req, res) => {
    res.send('Invalid endport')
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.use('/*', (req, res) => res.status(422).send("Unsupported path entity"));

// LISTEN TO PORT 4000
app.listen(port, () => { console.log(`start http server on port ${port}`) })
