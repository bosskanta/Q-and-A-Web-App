// Product.js
import React, { useEffect, useState, useContext } from 'react'

import { AuthContext } from './AuthContext';
import clsx from 'clsx';
import * as axios from 'axios'

import MyCardContent from './MyCardContent';
import CreateDialog from './CreateDialog';

import {
  makeStyles, ThemeProvider, createMuiTheme,
  CssBaseline,
  Typography, Paper, Grid, Divider, Button, AppBar, Tabs, Tab, Menu, MenuItem
} from '@material-ui/core'

import HomeIcon from '@material-ui/icons/Home';
import MyQuestionsIcon from '@material-ui/icons/Create';
import MyAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AddIcon from '@material-ui/icons/AddCircle';
import Person from '@material-ui/icons/Person';
import GameIcon from '@material-ui/icons/SportsEsportsOutlined';
import FoodIcon from '@material-ui/icons/FastfoodOutlined';
import MovieIcon from '@material-ui/icons/MovieOutlined';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF971D',
      contrastText: "#fff"
    },
    secondary: {
      main: '#2E69FF'
    },
    default: {
      main: '#FFFFFF'
    }
  },
})

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#F9F6F7"
  },
  paper: {
    height: 80,
    width: "100%",
  },
  tagnav: {
    height: 600,
    width: 250,
    marginTop: 10,
    marginLeft: 10,
    paddingTop: 30,
    backgroundColor: "#F9F6F7",
  },
  tagButton: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 40,
    width: 160,
    height: 40,
    backgroundColor: "#BFC4CA",
  },
  allColor: {
    backgroundColor: "#ffffff",
  },
  gamesColor: {
    backgroundColor: "#FFD6D6",
  },
  foodsColor: {
    backgroundColor: "#D6FFFB",
  },
  moviesColor: {
    backgroundColor: "#FFFCD6",
  },
  title: {
    fontFamily: 'Baskerville Old Face'
  },
  topnavItems: {
    height: "100%",
  },
  indicator: {
    backgroundColor: "#FF971D",
    height: "5px",
  },
  createButton: {
    borderRadius: 20,
    color: "#FFFFFF",
  }
}));

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}

const Home = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [tag, setTag] = useState('All');
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isShowCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetch('/question/All')
      .then(res => res.json())
      .then(res => {
        auth.setQuestions(res)
        auth.setQuestionsInfo(res)
        console.log("HOME")
        console.log(res)
      });
  }, [])

  const handleClickCreate = (isShow) => {
    console.log("TOGGLE CREATE QUESTION")
    setShowCreate(isShow)
  }

  const handleChange = async (event, newValue) => {
    setTag('All')
    auth.setQuestions(JSON.parse(sessionStorage.getItem('questions')))

    if (newValue === value) {
      console.log("Click same page")
      return;
    }

    switch (newValue) {
      case 0:
        fetch('/question/All')
          .then(res => res.json())
          .then(res => {
            auth.setQuestions(res)
            auth.setQuestionsInfo(res)
            console.log("HOME")
            console.log(res)
          });
        break

      case 1:
        try {
          let sendPackage = { userId: JSON.parse(sessionStorage.getItem('userInfo'))['_id'] }
          console.log(sendPackage)

          const { data } = await axios.post(
            '/answer/my',
            sendPackage
          );
          let tmp = []

          data.forEach(id => {
            let index = auth.questions.findIndex(question => question['_id'] === id)
            if (index !== -1) {
              tmp.push(auth.questions[index])
            }
          })

          tmp = tmp.reverse()

          auth.setQuestions(tmp)
          auth.setQuestionsInfo(tmp)

          console.log("MY ANSWER")
        }
        catch (error) {
          const { data } = error.response;
          console.log(data)
        }
        break

      case 2:
        try {
          let sendPackage = { userId: JSON.parse(sessionStorage.getItem('userInfo'))['_id'] }
          console.log(sendPackage)
          
          const { data } = await axios.post(
            '/question/my',
            sendPackage
          );

          auth.setQuestions(data)
          auth.setQuestionsInfo(data)

          console.log("MY QUESTION")
        }
        catch (error) {
          const { data } = error.response;
          console.log(data)
        }
        break

      default:
        console.log('/'); break
    }
    setValue(newValue);
  };

  const menuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    auth.logout()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <CreateDialog isShow={isShowCreate} handleClickCreate={handleClickCreate} />

      <Grid
        className={classes.root}
        container
        spacing={0}
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        style={{ minHeight: '100vh' }}
      >
        {/* TOP NAV */}
        <Grid item>
          <Paper className={classes.paper}>
            <Grid
              className={classes.topnavItems}
              container
              direction="row"
              justify="space-around"
              alignItems="flex-end">
              <Grid item className={classes.topnavItems}>
                <Typography className={classes.title} color='primary' align='center' variant='h2'>QnA</Typography>
              </Grid>
              <Grid item className={classes.topnavItems}>
                <AppBar position="static" elevation={0} style={{ background: '#FFFFFF' }} >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="off"
                    aria-label="scrollable prevent tabs example"
                    TabIndicatorProps={{ className: classes.indicator }}
                    style={{ height: "80px" }}
                  >
                    <Tab style={{ height: "80px" }} icon={<HomeIcon style={{ fontSize: 44, color: '#000000' }} />} aria-label="home" {...a11yProps(1)} />
                    <Tab icon={<MyQuestionsIcon style={{ fontSize: 40, color: '#000000' }} />} aria-label="questions" {...a11yProps(2)} />
                    <Tab icon={<MyAnswerIcon style={{ fontSize: 40, color: '#000000' }} />} aria-label="questions" {...a11yProps(3)} />
                  </Tabs>
                </AppBar>
              </Grid>
              <Grid item style={{ height: "100%", paddingTop: "20px" }} >
                <Button
                  startIcon={<Person style={{ fontSize: 30 }} />}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={menuClick}
                  style={{ textTransform: 'none' }}>
                  {JSON.parse(sessionStorage.getItem('userInfo')).firstName + " " + JSON.parse(sessionStorage.getItem('userInfo')).lastName}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                >
                  <MenuItem onClick={logOut}>Sign Out</MenuItem>
                </Menu>
              </Grid>
              <Grid style={{ height: "100%", paddingTop: "20px" }} item>
                <Button
                  className={classes.createButton}
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon style={{ fontSize: 30 }} />}
                  onClick={() => handleClickCreate(true)}>
                  CREATE QUESTION
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* END TOP NAV */}
        {/* CONTENT */}
        <Grid
          item
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {/* TAGS */}
          <Grid item>
            <Paper elevation={0} className={classes.tagnav}>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
              >
                <Button
                  className={clsx(classes.tagButton, classes.allColor)}
                  onClick={() => {
                    setTag('All')
                    auth.setQuestions(JSON.parse(sessionStorage.getItem('questions')))
                  }}
                  variant="contained">
                  All
                </Button>
                <Button
                  className={clsx(classes.tagButton, classes.gamesColor)}
                  onClick={() => {
                    setTag('Games')
                    auth.setQuestions(
                      JSON.parse(sessionStorage.getItem('questions')).filter(q => q.tag === 'Games')
                    )
                  }}
                  variant="contained"
                  startIcon={<GameIcon style={{ fontSize: 30 }} />}>
                  GAMES
                </Button>
                <Button
                  className={clsx(classes.tagButton, classes.foodsColor)}
                  onClick={() => {
                    setTag('Foods')
                    auth.setQuestions(
                      JSON.parse(sessionStorage.getItem('questions')).filter(q => q.tag === 'Foods')
                    )
                  }}
                  variant="contained"
                  startIcon={<FoodIcon style={{ fontSize: 30 }} />}>
                  foods
                </Button>
                <Button
                  className={clsx(classes.tagButton, classes.moviesColor)}
                  onClick={() => {
                    setTag('Movies')
                    auth.setQuestions(
                      JSON.parse(sessionStorage.getItem('questions')).filter(q => q.tag === 'Movies')
                    )
                  }}
                  variant="contained"
                  startIcon={<MovieIcon style={{ fontSize: 30 }} />}>
                  movies
                </Button>
                <Button className={classes.tagButton}
                  variant="contained">
                </Button>
                <Button className={classes.tagButton}
                  variant="contained">
                </Button>
              </Grid>
            </Paper>
          </Grid>
          {/* END TAGS */}

          <Divider style={{ width: "2px", marginTop: "15px", marginBottom: "40px" }} orientation="vertical" flexItem variant="fullWidth" />

          <Grid item>
            <MyCardContent tag={tag} questions={auth.questions} value={value} />
          </Grid>

        </Grid>
        {/* CONTENT */}
      </Grid>
    </ThemeProvider >
  )
}

export default Home;