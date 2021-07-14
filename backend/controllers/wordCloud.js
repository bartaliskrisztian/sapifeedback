var express = require('express')
var router = express.Router()
const {PythonShell} = require('python-shell');  // Import PythonShell module


const createWordCloud = (req, res) => {

    const feedbackText = req.body.text;
    const languageShort = req.body.language;
    let language = '';

    switch(languageShort){
      case 'en': language = 'english';break;
      case 'hu': language = 'hungarian';break;
      default: language = 'hungarian';
      break;
    }

    const options = { 
      mode: 'text', 
      pythonOptions: ['-u'], // get print results in real-time 
      scriptPath: '../', //If you are having python_test.py script in same folder, then it's optional. 
      args: [language, feedbackText] //An argument which can be accessed in the script using sys.argv[1] 
    }

    const pyshell = new PythonShell("word_cloud.py", options);
  
    pyshell.on("message", (data) => {
      res.send({result: data});
    });
  
    pyshell.end((err) => {
      res.send({result: err});
    })
}

router.post("/", createWordCloud)

module.exports = router