import "./App.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./App";
import { firebase } from "./utils/firebase";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import background from "./image/background.png";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { firebase } from "./utils/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: "1",
    marginRight: "10px",
  },
  background: {
    minHeight: "90vh",
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  },
}));


function Login() {
  let { user } = useContext(UserContext);

  const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Button edge="start" variant="h6" color="inherit" className={classes.user}>
              <b>ChatApp</b>
            </Button>
            <Button edge="start" variant="h6" color="inherit" className={classes.title}>
            </Button>            
            <Button className={classes.logoutbtn} color="inherit" onClick={function () {
              alert("Hello,you can enjoy chatting");
            }}>Hi, {user.displayName}</Button>

            <Button className={classes.logoutbtn} color="inherit" >|</Button>
            <Button className={classes.logoutbtn} color="inherit" onClick={function () {
              firebase.auth().signOut();
            }}>Logout</Button>
          </Toolbar>

        </AppBar>
      </div>
      <div className={classes.background}>


        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}>
          <div
style={{
  display: "flex",
  flexDirection: "row",
  width: "300px",
  padding: "100px",
  borderRadius: "20px",
  alignItems: "center",
  justifyContent: "center",
  background: "#222222",
}}
>
{user ? (
  <button
    onClick={function () {
      firebase.auth().signOut();
    }}
  >
    Logout
  </button>
) : (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
)}
</div>


        </div>

      </div>


    </div>
  );
}

export default Login;

