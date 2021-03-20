const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

let topicDetails = require("./controllers/topicDetails");
let createTopic = require("./controllers/createTopic");
let getUserTopics = require("./controllers/userTopics");

app.use(express.json());

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
})

app.use("/topic", topicDetails);
app.use("/", createTopic);
app.use("/", getUserTopics);

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));