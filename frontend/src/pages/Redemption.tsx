// import React from 'react';
import { useState } from 'react';
import Logo from '../assets/govtech.png';
import { resetDatabase, getStaffDetails, createRedemption } from '../services/API';
import { Box, Typography, TextField, Button, Container, Snackbar, Avatar, Alert, AlertColor } from '@mui/material'; 

export default function Redemption() {
  const [staffId, setStaffId] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [severity, setSeverity] = useState("success" as AlertColor);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleStaffIdChange = (event : any) => { 
    setStaffId(event.target.value); 
  }

  const checkValidStaffID = (event : any) => {
    getStaffDetails(staffId.toUpperCase())
      .then(response => { 
        if (response.result) { 
          setToastMessage("Staff ID is valid")
          setSeverity("success")
        } else { 
          setToastMessage("Staff ID is not valid")
          setSeverity("warning")
        }
        setToastOpen(true)
      })
      .catch(error => { 
        console.log(error.message)
        setToastMessage("Error in searching, please try again")
        setSeverity("error")
        setToastOpen(true)
      })
  }

  const redeemGift = async (event : any) => {
    const currentEpochMilliseconds: number = new Date().getTime();
    const redemptionDetails = { 
      staff_pass_id: staffId.toUpperCase(), 
      redeemed_at: currentEpochMilliseconds
    }
    createRedemption(redemptionDetails)
      .then(response => { 
        if (response.message === "Staff ID not found") { 
          setToastMessage("Staff ID is not valid, please enter a valid staff ID")
          setSeverity("warning")
        } else if (response.message === "Already redeemed") { 
          setToastMessage("Team has already redeemed gift, redeemed by: " + response.data.staff_pass_id)
          setSeverity("warning")
        } else if (response.message === "Redemption created successfully") { 
          setToastMessage("New redemption recorded")
          setSeverity("success")
        }
        setToastOpen(true)
      })
      .catch(error => { 
        console.log(error.message)
        setToastMessage("Error in redeeeming, please try again")
        setSeverity("error")
        setToastOpen(true)
      })
  }

  const resetRedemptions = (event : any) => {
    resetDatabase()
      .then(response => { 
        setToastMessage("All previous redemptions deleted")
        setSeverity("success")
        setToastOpen(true)
      })
      .catch(error => { 
        console.log(error.message)
        setToastMessage("Error in resetting redemptions")
        setSeverity("error")
        setToastOpen(true)
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        marginTop={'20%'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
      >
          <Avatar src={Logo} sx={{ width: 200, height: 200 }}>
            {/* <Box component="img" src={Logo} height={40}></Box> */}
          </Avatar>
          <Typography component="h1" variant="h5">
              Redeem your team's Christmas gift
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="staffId"
                  label="Staff Pass ID"
                  name="staffId"
                  value={staffId}
                  onChange={handleStaffIdChange}
                  autoFocus
              />
              <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  color='secondary'
                  onClick={checkValidStaffID}
              >
                  Check valid staff pass ID
              </Button>
              <Button
                  fullWidth
                  variant="contained"
                  sx={{ mb: 2 }}
                  color='secondary'
                  onClick={redeemGift}
              >
                  Redeem gift for team 
              </Button>
              <Button
                  fullWidth
                  variant="contained"
                  sx={{ mb: 2 }}
                  color='primary'
                  onClick={resetRedemptions}
              >
                  Reset the redemptions
              </Button>
          </Box>
          <Snackbar
              open={toastOpen}
              autoHideDuration={2100}
              onClose={handleToastClose}
          >
            <Alert onClose={handleToastClose} severity={severity} sx={{ width: '100%' }}>
              {toastMessage}
            </Alert>
          </Snackbar>
      </Box>
    </Container>
  );
}