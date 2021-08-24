import * as mongooseDef from 'mongoose'

let mongoose = mongooseDef.default;

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    createdDate: { type: Date, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: { type: String, required: true },
    upVoted: { type: Number },
    downVoted: { type: Number }
})

let Answer = mongoose.model('Answer', answerSchema, 'answers');
export default Answer;