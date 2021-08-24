import * as mongooseDef from 'mongoose'

let mongoose = mongooseDef.default;

const questionSchema = new mongoose.Schema({
    createdDate: { type: Date, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: { type: String, required: true },
    tag: { type: String, required: true },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    mostVotedAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }
})

questionSchema.methods.findMostUpVoted = function () {
    if (this.answers.length === 0) {
        this.mostVotedAnswerId = null;
        return;
    }

    let maxUpVoted = 0
    let tmpAnswerId = null
    let count = 1;
    this.answers.forEach(answer => {
        // console.log(count++)
        // console.log("CHECK ANSWER: " + answer.text)
        // console.log("MAX UPVOTED: " + maxUpVoted)
        // console.log("CURR UPVOTED: " + answer.upVoted)
        if (answer.upVoted > maxUpVoted) {
            maxUpVoted = answer.upVoted
            tmpAnswerId = answer['_id']
            // console.log("MOST UPVOTED ANSWER : " + answer.text)
        }
    })

    if (maxUpVoted === 0) {
        this.mostVotedAnswerId = this.answers[0]['_id']
        this.save()
        return;
    }
    
    this.mostVotedAnswerId = tmpAnswerId
    this.save()
}

let Question = mongoose.model('Question', questionSchema, 'questions');
export default Question;