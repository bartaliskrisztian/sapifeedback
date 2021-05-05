const express = require('express');
const app = express();
const http = require("http");

const server = http.createServer(app); // creating backend server
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
}); // creating websocket for realtime fetching of data

/* using middleware functions */

app.use((req, res, next) => {
  res.io = io;
  next();
}); // adding socket

app.use(express.json()); // parse request body as json

app.use(function(req,res,next){
  var _send = res.send;
  var sent = false;
  res.send = function(data){
      if(sent) return;
      _send.bind(res)(data);
      sent = true;
  };
  next();
}); // in order to not set headers after a response is sent

// importing controllers
let login = require("./controllers/login");
let topicDetails = require("./controllers/topicDetails");
let createTopic = require("./controllers/createTopic");
let getUserTopics = require("./controllers/userTopics");
let uploadReport = require("./controllers/uploadReport");
let createWordCloud = require("./controllers/wordCloud");
let createReportFrequency = require("./controllers/reportFrequency.js");


const apiPath = process.env.API_PATH;
app.use(`/${apiPath}/login`, login);
app.use(`/${apiPath}/topic`, topicDetails);
app.use(`/${apiPath}/topic/wordCloud`, createWordCloud);
app.use(`/${apiPath}/topic/report-frequency`, createReportFrequency);
app.use(`/${apiPath}/userTopics`, getUserTopics);
app.use(`/${apiPath}`, createTopic);
app.use(`/${apiPath}`, uploadReport);

// console.log that your server is up and running
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));
