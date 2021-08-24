import { logError } from '../util/util.js';
import Answer from '../model/Answer.js';
import Question from '../model/Question.js';

// Create and Save a new answer
export let create = (req, res) => {
    let { questionId, createdDate, userId, text } = req.body;
    console.log("Creating answer ", req.body)

    if (!questionId || !createdDate || !userId || !text)
        return res.status(422).json(logError('Missing answer information.'));

    var newAnswer = new Answer({
        questionId: questionId,
        createdDate: createdDate,
        createdBy: userId,
        text: text,
        upVoted: 0,
        downVoted: 0
    })

    Answer.init()
        .then(function () { // avoid dup by wait until finish building index
            newAnswer.save()
                .then(answer => {
                    Question.findById(questionId, function (err, q) {
                        if (err) return res.status(400).json(logError(err));

                        q.answers.push(answer['_id'])

                        // Update with callback
                        q.save(function (err) {
                            if (err) return res.status(400).json(logError(err));

                            Question.find({})
                                .populate('createdBy', '-_id firstName lastName')
                                .populate({
                                    path: 'answers',
                                    populate: { path: 'createdBy', select: '-_id firstName lastName' }
                                })
                                .sort('-createdDate')
                                .then(questions => {
                                    questions.forEach(question => question.findMostUpVoted())
                                    return res.json(questions);
                                })
                                .catch(err => {
                                    return res.status(500).json(logError(err));
                                });
                        });
                    })
                })
                .catch(err => {
                    return res.status(400).json(logError(err));
                });
        });


};

export let listMyAnswer = (req, res) => {
    let { userId } = req.body

    Answer.find({ createdBy: userId })
        .then(answers => {
            return res.json(answers.map(a => a.questionId))
        })
        .catch(err => {
            return res.status(500).json(logError(err));
        });
}

export let edit = (req, res) => {
    let { answerId, text } = req.body

    // Second parameter is callback
    Answer.findById(answerId, function (err, ans) {
        if (err) return res.status(400).json(logError(err));

        ans.text = text

        // Update with callback
        ans.save(function (err) {
            if (err) return res.status(400).json(logError(err));
            return res.json({
                success: true,
                message: `Edited answer ID: ${answerId}, SUCCESS.`,
                text: text
            });
        });
    })
}

export let upvote = (req, res) => {
    let { answerId } = req.body

    Answer.findOneAndUpdate({ _id: answerId }, { $inc: { 'upVoted': 1 } },
        function (err, response) {
            if (err) return res.status(400).json(logError(err));

            Question.find({})
                .populate('createdBy', '-_id firstName lastName')
                .populate({
                    path: 'answers',
                    populate: { path: 'createdBy', select: '-_id firstName lastName' }
                })
                .sort('-createdDate')
                .then(questions => {
                    questions.forEach(question => question.findMostUpVoted())
                    return res.json(questions);
                })
                .catch(err => {
                    return res.status(500).json(logError(err));
                });
        });
}

export let downvote = (req, res) => {
    let { answerId } = req.body

    Answer.findOneAndUpdate({ _id: answerId }, { $inc: { 'downVoted': 1 } },
        function (err, response) {
            if (err) return res.status(400).json(logError(err));

            Question.find({})
                .populate('createdBy', '-_id firstName lastName')
                .populate({
                    path: 'answers',
                    populate: { path: 'createdBy', select: '-_id firstName lastName' }
                })
                .sort('-createdDate')
                .then(questions => {
                    questions.forEach(question => question.findMostUpVoted())
                    return res.json(questions);
                })
                .catch(err => {
                    return res.status(500).json(logError(err));
                });
        });
}