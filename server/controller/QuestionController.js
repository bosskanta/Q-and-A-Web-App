import { logError } from '../util/util.js';
import Question from '../model/Question.js';

// Create and Save a new question
export let create = (req, res) => {
    let { createdDate, userId, text, tag } = req.body;
    console.log("Creating question ", req.body)

    if (!createdDate || !userId || !text || !tag)
        return res.status(422).json(logError('Missing question information.'));

    var newQuestion = new Question({
        createdDate: createdDate,
        createdBy: userId,
        text: text,
        tag: tag,
    })

    Question.init()
        .then(function () { // avoid dup by wait until finish building index
            newQuestion.save()
                .then(() => {
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
                })
                .catch(err => {
                    return res.status(400).json(logError(err));
                });
        });
};

// List questions base on tag
export let list = (req, res) => {
    const tag = req.params.tag;
    console.log(`Listing questions {${tag}}`)

    if (tag == "All") {
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
    }
    else {
        Question.find({ tag: tag })
            .populate('createdBy', '-_id firstName lastName')
            .populate({
                path: 'answers',
                populate: { path: 'createdBy', select: '-_id firstName lastName' }
            })
            .sort('-createdDate')
            .then(questions => {
                return res.json(questions);
            })
            .catch(err => {
                return res.status(500).json(logError(err));
            });
    }
};

// Lust My Questions
export let listMyQuestion = (req, res) => {
    let { userId } = req.body
    console.log(`Listing questions from userId: ${userId}`)

    Question.find({ createdBy: userId })
        .populate('createdBy', '-_id firstName lastName')
        .populate({
            path: 'answers',
            populate: { path: 'createdBy', select: '-_id firstName lastName' }
        })
        .sort('-createdDate')
        .then(questions => {
            return res.json(questions);
        })
        .catch(err => {
            return res.status(500).json(logError(err));
        });
}

// Get Question
export let getQuestion = (req, res) => {
    let { questionId } = req.params
    console.log("Get questionId: ", questionId)

    Question.findById(questionId)
        .populate('createdBy', '-_id firstName lastName')
        .populate('tagName', '-_id name')
        .populate({
            path: 'answers',
            populate: { path: 'createdBy', select: '-_id firstName lastName' }
        })
        .then(question => {
            if (!question) {
                return res.status(404).json(logError("Question not found with id " + req.params.userId));
            }
            else {
                return res.json(question);
            }
        })
        .catch(err => {
            return res.status(404).json(logError(err));
        });
}

// Edit Question
export let edit = (req, res) => {
    let { questionId, text } = req.body

    // Second parameter is callback
    Question.findById(questionId, function (err, question) {
        if (err) return res.status(400).json(logError(err));

        question.text = text

        // Update with callback
        question.save(function (err) {
            if (err) return res.status(400).json(logError(err));
            return res.json({
                success: true,
                message: `Edited question ID: ${questionId}, SUCCESS.`,
                text: text
            });
        });
    })
}