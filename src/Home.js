import "./App.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./App";
import { io } from "socket.io-client";
import { firebase } from "./utils/firebase";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import background from "./image/background.png";
import ReactScrollableFeed from 'react-scrollable-feed';

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


function Home() {
  let { user } = useContext(UserContext);
  let [socket, setSocket] = useState();
  let [target, setTarget] = useState("");
  let [message, setMessage] = useState("");
  let [messages, setMessages] = useState([]);
  let [active, setActive] = useState([]);
  let [send, setSend] = useState("ALL");

  useEffect(async function () {
    let token = await user.getIdToken(true);
    // console.log(token);
    let sock = io("https://morning-fortress-96224.herokuapp.com/", {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    sock.on("connect", function () {
      console.log("You are connected");
      setSocket(sock);
    });

    sock.on("disconnect", function () {
      setSocket(null);
    });

    sock.on("message", function (payload) {
      setMessages((messages) => {
        let gen = [...messages];
        gen.push(payload);
        return gen;
      });
    });

    sock.on("active", function (payload) {
      setActive(payload);
    });
  }, []);





  const classes = useStyles();
  return socket ? (
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
          <div style={{
            background: "#D3D3D3",
            borderRadius: "20px",
            minHeight: "60vh",
            maxHeight: "60vh",
            width: "50vw",
            padding: "10px",
            opacity: "90%",
            marginTop: "5vh",
          }}>
            <ReactScrollableFeed>
            {messages.map(function (messageItem, idx) {

return (messageItem.senderName == user.displayName || messageItem.senderName.slice(0, -10) == user.displayName) ? (
  <p key={idx}>
    <button style={{
      backgroundColor: "white",
      borderRadius: "10px",
      fontSize: "100%",
      fontWeight: "700",
      margin: ".3vh",
      float: "right",
      clear: "both"
    }}>
      {messageItem.senderName} : {messageItem.message}
    </button>
  </p>
) : (
  <p key={idx}>
    <button style={{
      backgroundColor: "white",
      borderRadius: "10px",
      fontSize: "100%",
      fontWeight: "700",
      margin: ".3vh",
      float: "left",
      clear: "both"
    }}>
      {messageItem.senderName} : {messageItem.message}
    </button>
  </p>
);
})}
            </ReactScrollableFeed>

          </div>

          <div style={{
            width: "50vw",
          }}>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "10px",
                justifyContent: "center"
              }}
            >
              <button
                onClick={() => {
                  setTarget("");
                  setSend("ALL")
                }}
                style={{
                  margin: "10px",
                }}
              >
                All
            </button>
              {active.map(function (person) {
                return (user.uid !== person.uid) ? (
                  <button
                    onClick={() => {
                      console.log(person);
                      setTarget(person.uid);
                      setSend(person.name)
                    }}
                    style={{
                      margin: "10px",
                    }}
                  >
                    {person.name}
                  </button>
                ) : undefined
              })}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "10px",
                borderRadius: "20px",
              }}
            >

              <input
                style={{
                  flexGrow: 3,
                  height: "50px",
                  margin: "10px",
                }}
                value={message}
                state={send}
                placeholder={send}
                onChange={function (event) {
                  setMessage(event.target.value);
                  console.log(event.target.value);

                }}
              ></input>
              <button
                style={{
                  height: "50px",
                  margin: "10px",
                  borderRadius: "15px",
                  color: "#696969",
                }}
                onClick={function () {
                  if (message != "") {
                    socket.emit("message", {
                      message: message,
                      targetId: target,
                    });
                    setTarget("");
                    setMessage("");
                    setSend("ALL");

                  }
                }}
              >
                Send -->
  </button>
            </div>
          </div>
        </div>

      </div>


    </div>
  ) : (
    <h1>You are disconnected. Connecting you back.</h1>
  );
}

export default Home;
