import React, { useState, useContext } from 'react'

import { AuthContext } from './AuthContext';
import * as axios from 'axios'

import {
   makeStyles,
   Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button, Typography, Avatar,
   FormControl, Select, MenuItem
} from '@material-ui/core'
import Person from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
   dialog: {
      paddingBottom: 16,
      paddingTop: 10,
      paddingRight: 20,
      paddingLeft: 16,
      width: 600
   },
   formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
   },
   bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
   },
}))

export default function CreateDialog(props) {
   const auth = useContext(AuthContext);
   const classes = useStyles();
   const [questionText, setQuestionText] = useState('')
   const [selectedTag, setSelectedTag] = useState('Games')
   const [error, setError] = useState(false)

   const handleClose = () => {
      props.handleClickCreate(false)
      setError(false)
      setQuestionText('')
   };

   const handleCreate = async () => {
      if (questionText === '') {
         setError(true);
         return
      }

      let sendPackage = {
         createdDate: new Date(),
         userId: JSON.parse(sessionStorage.getItem('userInfo'))['_id'],
         text: questionText,
         tag: selectedTag,
      }

      console.log(sendPackage)

      try {
         const { data } = await axios.post(
            '/question/create',
            sendPackage
         );
         auth.setQuestionsInfo(data)
         auth.setQuestions(data)
         setQuestionText('')
         setSelectedTag('Games')
         props.handleClickCreate(false)
         setError(false)
      }
      catch (error) {
         const { data } = error.response;
         console.log(data)
      }
   }

   const handleTagChange = (event) => {
      setSelectedTag(event.target.value)
      setError(false)
   }

   return (
      <>
         <Dialog
            disableBackdropClick
            PaperProps={{ classes: { root: classes.dialog } }}
            open={props.isShow} aria-labelledby="create-dialog"
         >
            <DialogTitle id="form-dialog-title">
               <Typography style={{ fontSize: 30 }} align="center">Create question</Typography>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 8px" }}>
               <DialogContentText align="center" style={{ fontStyle: "italic" }}>
                  "Keep your question short and to the point"
               </DialogContentText>
               <br></br>
               <Button
                  disableRipple
                  startIcon={<Avatar style={{ backgroundColor: '#F9F6F7' }}><Person style={{ fontSize: 30, color: '#000000' }} /></Avatar>}
                  style={{ textTransform: 'none', backgroundColor: 'transparent' }}
               >
                  {JSON.parse(sessionStorage.getItem('userInfo')).firstName + " " + JSON.parse(sessionStorage.getItem('userInfo')).lastName}
                  <span style={{ fontStyle: "italic", color: "#666667", paddingLeft: 8 }}>Asking</span>
               </Button>
               <TextField
                  error={error ? true : false}
                  helperText={error ? "Required": ""}
                  multiline
                  rowsMax={20}
                  color="secondary"
                  autoFocus
                  margin="dense"
                  id="name"
                  placeholder="Type your question here"
                  type="email"
                  fullWidth
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
               />
            </DialogContent>
            <DialogActions>
               <Typography>Select tag:</Typography>
               <FormControl variant="outlined" className={classes.formControl} size="small" >
                  <Select
                     value={selectedTag}
                     onChange={handleTagChange}
                  >
                     <MenuItem value={'Games'}>Games</MenuItem>
                     <MenuItem value={'Foods'}>Foods</MenuItem>
                     <MenuItem value={'Movies'}>Movies</MenuItem>
                  </Select>
               </FormControl>
               <div style={{ flex: '1 0 0' }} />
               <Button style={{ backgroundColor: 'transparent' }} disableRipple disableFocusRipple onClick={handleClose} >
                  Cancel
               </Button>
               <Button disableFocusRipple variant="contained" color="secondary" onClick={handleCreate} style={{ borderRadius: 40 }}>
                  Create
               </Button>
            </DialogActions>
         </Dialog>
      </>
   )
}