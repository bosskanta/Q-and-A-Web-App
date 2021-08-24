import React, { useState, useContext } from 'react'
import {
    makeStyles,
    Paper, Grid, Box, TextField, Button, ButtonGroup,
} from '@material-ui/core'

import * as axios from 'axios'

import { AuthContext } from './AuthContext';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Person from '@material-ui/icons/Person';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import VoteIcon from '@material-ui/icons/ForwardOutlined';
import CommentIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';

const useStyles = makeStyles((theme) => ({
    paper: {
        width: 1100,
        // height: 360,
        paddingLeft: 10,
        paddingTop: 10,
    },
    tagButton: {
        borderRadius: 20,
        height: 28,
        marginLeft: 70,
        marginTop: -10,
        marginBottom: 10,
    },
    expand: {
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    person: {
        fontSize: 30,
    },
    voteButton: {
        backgroundColor: '#F9F6F7',
        marginLeft: 2,
    },
    answerField: {
        width: 960,
        margin: 28,
        marginLeft: 10
    }
}))

const Tag = (props) => {
    const classes = useStyles();

    let color
    switch (props.name) {
        case 'Games':
            color = '#FFD6D6'
            break

        case 'Foods':
            color = '#D6FFFB'
            break

        case 'Movies':
            color = '#FFFCD6'
            break

        default:
            color = '#797979'
            break
    }

    return (
        <Button
            className={classes.tagButton}
            style={{ backgroundColor: color, borderRadius: 20 }}
            variant="contained">
            {props.name}
        </Button>
    )
}

const convertDate = (dateString) => {
    var created_date = new Date(dateString);

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var month = months[created_date.getMonth()];
    var date = created_date.getDate();

    var result = `${created_date.toDateString().substr(0, 3)}, ${month} ${date}, ${created_date.toLocaleTimeString()}`;
    return result
}

export default function MyCardContent(props) {
    const auth = useContext(AuthContext);
    const classes = useStyles();
    const [selectedQuestion, setSelectedQuestion] = useState('none')
    const [answerValue, setAnswerValue] = useState('')

    const handleExpandClick = (questionId) => {
        if (selectedQuestion === questionId) setSelectedQuestion('')
        else setSelectedQuestion(questionId)
    };

    const handleSubmitAnswer = async (event, questionId) => {
        event.preventDefault();

        if (document.getElementById("answer-" + questionId).value === "") return

        let sendPackage = {
            questionId: questionId,
            createdDate: new Date(),
            userId: JSON.parse(sessionStorage.getItem('userInfo'))['_id'],
            text: answerValue
        }

        console.log(sendPackage)
        document.getElementById(questionId).reset();

        try {
            const { data } = await axios.post(
                '/answer/create',
                sendPackage
            );
            auth.setQuestionsInfo(data)
            auth.setQuestions(data)
            setAnswerValue('')
        }
        catch (error) {
            const { data } = error.response;
            console.log(data)
        }
    }

    const handleAnswerChange = (value) => {
        setAnswerValue(value)
    }

    const handleClickVote = async (answerId, voteStatus) => {
        let sendPackage = { answerId: answerId }

        try {
            const { data } = await axios.post(
                `/answer/${voteStatus}`,
                sendPackage
            );
            auth.setQuestionsInfo(data)
            auth.setQuestions(data)
        }
        catch (error) {
            const { data } = error.response;
            console.log(data)
        }
    }

    const bull = <span className={classes.bullet}>•</span>;

    let VoteButton = (isShow, upVoted, downVoted, answerId) => {
        return (
            isShow ?
                <ButtonGroup disableElevation variant="contained">
                    <Button className={classes.voteButton} onClick={() => handleClickVote(answerId, 'upvote')}>
                        <VoteIcon color='primary' style={{ transform: 'rotate(-90deg)' }} />{upVoted === 0 ? '' : upVoted}
                    </Button>
                    <Button className={classes.voteButton} onClick={() => handleClickVote(answerId, 'downvote')}>
                        <VoteIcon color='disabled' style={{ transform: 'rotate(90deg)' }} />{downVoted === 0 ? '' : downVoted}
                    </Button>
                </ButtonGroup>
                : <></>
        )
    }

    let QuestionContent = (question) => {
        let bestAnswer = question.answers.find(answer => answer['_id'] === question.mostVotedAnswerId)
        let answer, isShow, upVoted, downVoted

        if (bestAnswer === undefined) {
            answer = 'No one answer yet'
            isShow = false
            upVoted = 0
            downVoted = 0
        } else {
            answer = bestAnswer.text
            isShow = true
            upVoted = bestAnswer.upVoted
            downVoted = bestAnswer.downVoted
        }

        let AnswerContent = question.answers.map(ans => {
            return (
                <Card key={ans['_id']} elevation={0} style={{ marginLeft: 20 }}>
                    <CardHeader
                        avatar={
                            <Avatar style={{ backgroundColor: '#F9F6F7' }}><Person style={{ fontSize: 30, color: '#000000' }} /></Avatar>
                        }
                        title={ans.createdBy.firstName + " " + ans.createdBy.lastName}
                        subheader={
                            convertDate(ans.createdDate)
                        }>
                    </CardHeader>
                    <CardContent>
                        <p style={{ color: '#000000', fontSize: 16, marginBottom: -16, marginTop: -16 }}>{ans.text}</p>
                    </CardContent>
                    <CardActions disableSpacing>
                        {VoteButton(true, ans.upVoted, ans.downVoted, ans['_id'])}
                    </CardActions>
                </Card>
            )
        })

        let BestAnswer = (
            <>
                <Tag name={question.tag} />
                <Card elevation={0}>
                    <CardHeader
                        title={question.text}
                        subheader={<p style={{ color: '#000000', fontSize: 18, marginBottom: -16 }}>{answer}</p>}
                    />
                    <CardActions disableSpacing>
                        {VoteButton(isShow, upVoted, downVoted, question.mostVotedAnswerId)}
                        <Box className={classes.expand}>
                            {bestAnswer === undefined ?
                                <>

                                </>
                                :
                                <IconButton
                                    onClick={() => {
                                        if (selectedQuestion === 'none') setSelectedQuestion(question['_id'])
                                        handleExpandClick(question['_id'])
                                    }}>
                                    <CommentIcon />{question.answers.length}
                                </IconButton>}
                        </Box>
                    </CardActions>
                    <Collapse in={selectedQuestion === question['_id']} timeout="auto" unmountOnExit>
                        {/* Answer Contents */}
                        {AnswerContent}
                    </Collapse>
                </Card>
            </>
        )

        return (
            <>
                <Card elevation={0}>
                    <CardHeader
                        avatar={
                            <Avatar style={{ backgroundColor: '#F9F6F7' }}><Person style={{ fontSize: 30, color: '#000000' }} /></Avatar>
                        }
                        // title={question.createdBy.firstName + " " + question.createdBy.lastName} 
                        title={
                            <>
                                {question.createdBy.firstName + " " + question.createdBy.lastName}
                            </>
                        }
                        subheader={
                            <><span style={{ fontWeight: "bold" }}>{'Asked'}</span>{bull}{convertDate(question.createdDate)}</>
                        }>
                    </CardHeader>

                    {/* <Tag name={question.tag} /> */}
                </Card>
                {/* <Typography style={{ marginTop: 12, marginBottom: 12 }} variant="h5">{question.text}</Typography> */}
                {BestAnswer}
                <form id={question['_id']} autoComplete="off" onSubmit={e => handleSubmitAnswer(e, question['_id'])}>
                    <TextField
                        id={"answer-" + question['_id']}
                        className={classes.answerField}
                        size="small"
                        multiline
                        rowsMax={20}
                        onChange={e => handleAnswerChange(e.target.value)}
                        // onClick={() => handleClickAnswer(question['_id'])}
                        variant="outlined"
                        placeholder="Type your answer here"
                    />
                    <Button style={{ marginTop: 28 }} variant="contained" type="submit" color='secondary'>
                        Send
                    </Button>
                </form>

            </>
        )
    }

    let Questions = props.questions.map(question => {
        return (
            <Grid item key={question._id} style={{ marginTop: "28px" }}>
                <Paper className={classes.paper}>
                    {/* <Typography variant="h3">{question.text}</Typography> */}
                    <Box style={{ height: "100%" }}>
                        <Box width="100%" display="inline-block">
                            {QuestionContent(question)}
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        )
    })

    let EmptyQuestion = (
        <Grid style={{ marginTop: "28px" }}>
            There are empty questions
        </Grid>
    )
    
    let TitleText = ''
    
    switch(props.value) {
        case 1:
            TitleText = `My answers from "${props.tag}" tag`; break
        case 2:
            TitleText = `My questions from "${props.tag}" tag`; break
        default:
            TitleText = `Questions from "${props.tag}" tag`
    }

    return (
        <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            style={{ marginTop: "48px", marginBottom: "80px", paddingLeft: "80px" }}
        >
            <Grid item>
                <Typography variant="h4">{TitleText}</Typography>
            </Grid>
            {props.questions.length !== 0 ? Questions : EmptyQuestion}
        </Grid>
    )
}