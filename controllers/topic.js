var express = require('express')
var router = express.Router()

const {PythonShell} = require('python-shell')  // Import PythonShell module

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

router.get("/:userId/:topicId/statistics", myFunction)

module.exports = router