var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');
const {PythonShell} = require('python-shell');  // Import PythonShell module


const createWordCloud = (req, res) => {

    // getting the parameters sent from the client side
    const userId = req.params.userId;
    const topicId = req.params.topicId;
    const ref = admin.db.ref(`reports/${topicId}`);

    ref.once("value", (snapshot) => {
      let temp = Object.values(snapshot.val());
      let reportTexts = temp.map((report) => report.text);
      let options = { 
        mode: 'text', 
        pythonOptions: ['-u'], // get print results in real-time 
        scriptPath: './python_scripts', //If you are having python_test.py script in same folder, then it's optional. 
        args: [reportTexts] //An argument which can be accessed in the script using sys.argv[1] 
      }

      const pyshell = new PythonShell("word_cloud.py", options);
    
      pyshell.on("message", (data) => {
        res.send({result: data})
      });
    
      pyshell.end((err) => {
        if(err) throw err
      })
  });
  }

router.get("/:userId/:topicId/wordCloud", createWordCloud)

module.exports = router