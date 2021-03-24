var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');
const {PythonShell} = require('python-shell')  // Import PythonShell module

// controller for handling GET request about a topic

const myFunction = (req, res) => {

    let options = { 
        mode: 'text', 
        pythonOptions: ['-u'], // get print results in real-time 
        scriptPath: './python_scripts', //If you are having python_test.py script in same folder, then it's optional. 
        args: [req.params.userId, req.params.topicId] //An argument which can be accessed in the script using sys.argv[1] 
      }
      
    const pyshell = new PythonShell("test.py", options)
    pyshell.send(JSON.stringify([1,2,3,4,5]))
    pyshell.on("message", (message) => {
      res.send({result: message})
    });
  
    pyshell.end((err) => {
      if(err) throw err
    })
  }

const getTopicReports = (req, res) => {
  // getting the parameters sent from the client side
    const topicId = req.params.topicId;
    const ref = admin.db.ref(`reports/${topicId}`);
    let result = [];
    
    // when there is a change between these reports, we send them to the client with the help of a websocket 
    ref.on("value", (snapshot) => {
        if (snapshot.val()) {
            result = snapshot.val();
        }
        res.io.emit("getTopicReports", {result: snapshot.val()}); // sending response to client with socket
    });
}

const getTopicDetails = (req, res) => {
  // getting the parameters sent from the client side
    const userId = req.params.userId;
    const topicId = req.params.topicId;

    const ref = admin.db.ref(`topics/${userId}/${topicId}`);
    ref.on("value", (snapshot) => {
        res.send({result: snapshot.val()}) // sending response to client
    });
}

router.get("/:userId/:topicId/reports", getTopicReports)
router.get("/:userId/:topicId/details", getTopicDetails)
//router.get("/:userId/:topicId/statistics", myFunction)

module.exports = router