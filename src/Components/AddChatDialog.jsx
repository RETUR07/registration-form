import { React, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';


const axios = require('axios').default;


function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [checked, setChecked] = useState([]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5050/api/Chat',
      data:{
        "users": checked,
      }
      })
      .catch(
          (error) => {
            console.log(error); 
      })
    onClose();
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Add users</DialogTitle>
      <DialogContent dividers>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {props.value.map((user) => {
        const labelId = `checkbox-list-label-${user.id}`;

        return (
          <ListItem
            key={user.id}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(user.id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(user.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={user.userName} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ConfirmationDialog() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:5050/api/User',
      })
      .then(
      (response) => {
          if(response.data && response.data.length !== 0)
          {
            setUsers(response.data);
          }
      })
      .catch(
          (error) => {
            console.log(error); 
      })
  }, []);

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box button>
        <ListItem
          button
          aria-controls="add-chat"
          aria-label="add chat"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Add chat"/>
        </ListItem>

        <ConfirmationDialogRaw
        id="add-chat"
        keepMounted
        open={open}
        onClose={handleClose}
        value={users}
      />
    </Box>
  );
}
