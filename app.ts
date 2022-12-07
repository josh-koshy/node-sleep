import * as express from "express";
// import * as prmpt from "prompt-sync";
import * as bodyParser from "body-parser";
var helmet = require("helmet");
import * as https from "https";
import * as fs from "fs";
const { authenticator } = require('otplib');
const router = express.Router();
const app = express();
import {logger} from '/home/ubuntu/sweb/logger.js';
import {shutdownJosh, sleepJosh} from "/home/ubuntu/sweb/sshRequest.js";

app.use(helmet());
app.listen(80);

const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.enable('trust proxy')
app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
})

function checkToken(token: any) {
  try {
    const isValid = authenticator.check(token, secret);
    return isValid;
  } catch (err) {
    console.error(err);
    return false;
  }
}

router.post('/',(request,response) => {
  //code to perform particular action.
  if (checkToken(request.body.user) == true) response.send("You are authed\n");
  else response.send("User is not added to list...\n")
  console.log(request.body)
  });

  function newToken() {
    const token = authenticator.generate(secret);
    return token;
  }

  var oneTimeVar = "Elephant1";
  var checked = "";
  var retriesOnCurrentToken = 0


  router.post('/sleep',(req,res) => {
    //code to perform particular action.
      if ((req.headers.device == "macbook") && (req.body.totp == "sHppScEXwkpNAH9NGYiW")) {
        res.send('{"Status":"Authorization Successful"}');
        sleepJosh();
        logger("POST with private key", req.ip);
      }
      else {
        res.send('{"Status":"Error!"}');
        logger("Error with POST with private key", req.ip);
      }
    });


  router.get('/sleep',(req,res) => {
    //code to perform particular action.
      if (checkToken(req.query.totp) == true) {
        if (checked == newToken()) { 
          retriesOnCurrentToken = retriesOnCurrentToken + 1
          logger("Unsuccessful TOTP on GET, " + retriesOnCurrentToken.toString() + " TOO MANY TRIES", req.ip)
          return res.send('{"Status":"Error! Called ' + retriesOnCurrentToken.toString() + ' too many times!"}'); }
        else { 
          checked = newToken(); 
          retriesOnCurrentToken = 0;
          res.send('{"Status":"Authorization Successful"}');
          sleepJosh();
          logger("Successful TOTP on GET", req.ip);
        }
      }
      else if ((req.query.password) == oneTimeVar) {
        sleepJosh();
        oneTimeVar = ""
        res.send('{"Status":"Authorization Successful"}');
        logger("backup code on GET", req.ip);
      }
      else {
        res.send('{"Status":"Error! Invalid Token"}');
        logger("Invalid Token Given!", req.ip);
      }  
    });

  router.post('/shutdown',(req,res) => {
    //code to perform particular action.
      if (req.headers.password == "<enter-password>") {
        res.send('{"Status":"Authorization Successful"}');
        (shutdownJosh());
        logger("shutdown", req.ip);
      }
      else {
        res.send('{"Status":"Error!"}');
      }
    });


// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile('/home/ubuntu/sweb/internal.html');
});

app.use("/", router);
  
https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("/etc/letsencrypt/live/koshy.dev/privkey.pem"),
      cert: fs.readFileSync("/etc/letsencrypt/live/koshy.dev/fullchain.pem")
    },
    app
  )
  .listen(443, () => {
    console.log("server is runing at port 443");
  });

import * as WebSocketServer from 'ws';
const wss = new WebSocketServer.Server({ port: 8080 })
  
 
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
  ws.send('something');
});
