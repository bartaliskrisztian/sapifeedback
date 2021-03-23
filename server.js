let topicDetails = require("./controllers/topicDetails");
let createTopic = require("./controllers/createTopic");
let getUserTopics = require("./controllers/userTopics");
let uploadReport = require("./controllers/uploadReport");

const express = require('express');
const app = express();

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use((req, res, next) => {
  res.io = io;
  next();
});

app.use(express.json());

app.use(function(req,res,next){
  var _send = res.send;
  var sent = false;
  res.send = function(data){
      if(sent) return;
      _send.bind(res)(data);
      sent = true;
  };
  next();
});

app.use("/api/topic", topicDetails);
app.use("/api", createTopic);
app.use("/api/userTopics", getUserTopics);
app.use("/api", uploadReport);

// console.log that your server is up and running
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));