var express = require('express')
var router = express.Router()
const {PythonShell} = require('python-shell');  // Import PythonShell module


const createFeedbackFrequencyFigure = (req, res) => {

    const dates_timestamp = req.body.dates;
    const options = { 
      mode: 'text', 
      pythonOptions: ['-u'], // get print results in real-time 
      scriptPath: './python_scripts', //If you are having python_test.py script in same folder, then it's optional. 
      args: [dates_timestamp] //An argument which can be accessed in the script using sys.argv[1] 
    }

    const pyshell = new PythonShell("feedback_frequency.py", options);
  
    pyshell.on("message", (data) => {
      res.send({result: data})
    });
  
    pyshell.end((err) => {
      if(err) throw err
    })
}

router.post("/", createFeedbackFrequencyFigure)

module.exports = router