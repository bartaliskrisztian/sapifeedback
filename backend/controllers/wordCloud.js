var express = require('express')
var router = express.Router()
const {PythonShell} = require('python-shell');  // Import PythonShell module


const createWordCloud = (req, res) => {

    const reportsText = req.body.text;
    const options = { 
      mode: 'text', 
      pythonOptions: ['-u'], // get print results in real-time 
      scriptPath: './python_scripts', //If you are having python_test.py script in same folder, then it's optional. 
      args: [reportsText] //An argument which can be accessed in the script using sys.argv[1] 
    }

    const pyshell = new PythonShell("word_cloud.py", options);
  
    pyshell.on("message", (data) => {
      res.send({result: data})
    });
  
    pyshell.end((err) => {
      if(err) throw err
    })
}

router.post("/:userId/:topicId/wordCloud", createWordCloud)

module.exports = router