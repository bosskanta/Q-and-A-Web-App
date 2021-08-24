import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as axios from 'axios'
import * as Yup from 'yup';
import {
  makeStyles, ThemeProvider, createMuiTheme,
  CssBaseline,
  Typography, Paper, Grid, Divider, TextField, Button
} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF971D',
    },
    secondary: {
      main: '#2E69FF'
    },
  },
})

const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(3),
    marginBotom: theme.spacing(2),
    width: '35ch',
  },
  button: {
    marginTop: theme.spacing(2),
  },
  paper: {
    height: 660,
    width: 700,
  },
  title: {
    fontFamily: 'Baskerville Old Face'
  },
  form: {
    marginLeft: 10,
    marginRight: 10
  },
}));

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Required'),
  lastName: Yup.string()
    .required('Required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Password must contain at least 6 characters')
    .required('Required')
});

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Password must contain at least 6 characters')
    .required('Required')
});

function SignInUp() {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);

  const signUp = async credentials => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/user/signup',
        credentials
      );
      let { user } = data;
      let context = {
        token: user.token,
        userInfo: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName
        },
        expiresAt: new Date().getTime() + user.expiresIn
      };
      auth.setAuthState(context);
      setSuccess(true)
      setSubmitionCompleted(true);
    }
    catch (error) {
      setLoading(true);
      const { data } = error.response;
      console.log(data)
      setSuccess(false)
      setSubmitionCompleted(true)
    }
  };

  const signIn = async credentials => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/user/signin',
        credentials
      );
      let { user } = data;
      let context = {
        token: user.token,
        userInfo: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName
        },
        expiresAt: new Date().getTime() + user.expiresIn
      };
      auth.setAuthState(context);
      setSuccess(true)
      setSubmitionCompleted(true);
    }
    catch (error) {
      setLoading(true);
      const { data } = error.response;
      console.log(data)
      setSuccess(false)
      setSubmitionCompleted(true)
    }
  };

  const handleClose = () => {
    if (success) {
      setRedirect(true)
      history.push('/home');
    }
    setLoading(false);
    setSubmitionCompleted(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {redirect && auth.isAuthenticated() && <Redirect to="/home" />}

      <Dialog open={isSubmitionCompleted} onClose={handleClose} aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">{success ? 'Success' : 'Sorry :('}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {success ? 'Redirect to Home page' : 'Wrong email or password. Please try again.'}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid
              container
              spacing={2}
              direction="column"
              justify="space-evenly"
              alignItems="center">
              <Grid item>
                <Typography className={classes.title} color='primary' align='center' variant='h1'>QnA</Typography>
                <Typography variant='h6'>A place to share knowledge and help each other</Typography>
              </Grid>
              <Grid
                item
                container
                direction="row"
                justify="space-evenly"
                alignItems="flex-start">
                {/* SIGN UP */}
                <Grid className={classes.form} item >
                  <Formik
                    initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
                    onSubmit={values =>
                      signUp(values)
                    }
                    validationSchema={SignUpSchema}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isValidating,
                    }) => (
                      <form autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                          <TextField
                            label="First Name"
                            name="firstName"
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                            color="secondary"

                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.firstName && touched.firstName}
                            helperText={(errors.firstName && touched.firstName) && errors.firstName}
                          />
                        </div>
                        <div>
                          <TextField
                            label="Last Name"
                            name="lastName"
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                            color="secondary"

                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.lastName && touched.lastName}
                            helperText={(errors.lastName && touched.lastName) && errors.lastName}
                          />
                        </div>
                        <div>
                          <TextField
                            label="Email"
                            name="email"
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                            color="secondary"

                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email && touched.email}
                            helperText={(errors.email && touched.email) && errors.email}
                          />
                        </div>
                        <div>
                          <TextField
                            label="Password"
                            id="password"
                            type="password"
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                            color="secondary"
                            margin="normal"

                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.password && touched.password}
                            helperText={(errors.password && touched.password) && errors.password}
                          />
                        </div>
                        <div>
                          <Button className={classes.button} variant="contained" disabled={isLoading} color="secondary" type="submit">
                            Sign up
                            </Button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </Grid>
                {/* END SIGN UP */}
                <Divider orientation="vertical" flexItem variant="fullWidth" />
                {/* SIGN IN */}
                <Grid className={classes.form} item >
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    onSubmit={values =>
                      signIn(values)
                    }
                    validationSchema={SignInSchema}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isValidating,
                    }) => (
                      <form autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                          <TextField
                            label="Email"
                            name="email"
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                            color="secondary"

                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email && touched.email}
                            helperText={(errors.email && touched.email) && errors.email}
                          />
                        </div>
                        <div>
                          <TextField
                            label="Password"
                            id="password"
                            type="password"
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                            color="secondary"
                            margin="normal"

                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.password && touched.password}
                            helperText={(errors.password && touched.password) && errors.password}
                          />
                        </div>
                        <div>
                          <Button className={classes.button} variant="contained" disabled={isLoading} color="secondary" type="submit">
                            Sign in
                          </Button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </Grid>
                {/* END SIGN IN */}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>



    </ThemeProvider>
  )
}

export default SignInUp;