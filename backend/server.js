const express = require('express');
const cors = require('cors');
const app = express();
const http = require("http");
const server = http.createServer(app); // creating backend server

const socketOptions = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
}
const io = require("socket.io")(server, socketOptions); // creating websocket for realtime fetching of data

/* using middleware functions */

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((_, res, next) => {
  res.io = io;
  next();
}); // adding socket

app.use(express.json()); // parse request body as json

app.use(function(_,res,next){
  var _send = res.send;
  var sent = false;
  res.send = function(data){
      if(sent) return;
      _send.bind(res)(data);
      sent = true;
  };
  next();
}); // in order to not set headers after a response is sent

if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

// importing controllers
let login = require("./controllers/login");
let topicDetails = require("./controllers/topicDetails");
let createTopic = require("./controllers/createTopic");
let getUserTopics = require("./controllers/userTopics");
let uploadFeedback = require("./controllers/uploadFeedback");
let createWordCloud = require("./controllers/wordCloud");
let createFeedbackFrequency = require("./controllers/feedbackFrequency");
let deleteTopic = require("./controllers/deleteTopic");


app.use('/api/login', login);
app.use('/api/topic', topicDetails);
app.use('/api/topic/wordCloud', createWordCloud);
app.use('/api/topic/feedback-frequency', createFeedbackFrequency);
app.use('/api/userTopics', getUserTopics);
app.use('/api', createTopic);
app.use('/api', uploadFeedback);
app.use('/api/deleteTopic', deleteTopic);

// console.log that your server is up and running
const port = process.env.PORT || 5000;
app.set("port", port);

app.get('/', (_, res) =>{
  res.send('SapiFeedback api is running.');
  }
);

server.listen(app.get("port"), () => console.log(`Listening on port ${port}`));



