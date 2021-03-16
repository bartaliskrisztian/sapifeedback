const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//Import PythonShell module. 
const {PythonShell} =require('python-shell'); 

let options = { 
        mode: 'text', 
        pythonOptions: ['-u'], // get print results in real-time 
        scriptPath: 'python_scripts', //If you are having python_test.py script in same folder, then it's optional. 
        args: [] //An argument which can be accessed in the script using sys.argv[1] 
}; 

let shell = new PythonShell('test.py', options, {mode: 'json'});



// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get("/", (req, res, next)=>{ 
  
  shell.on('message', function (message) {
    // handle message (a line of text from stdout, parsed as JSON)
    console.log(message);
    res.send(JSON.parse({result: message}));
  });

  shell.on('stderr', function (stderr) {
    res.send(JSON.parse({errort: stderr}));
  });

  // PythonShell.run('test.py', options, function (err, result){ 
  //       if (err) throw err; 
  //       // result is an array consisting of messages collected  
  //       //during execution of script. 
  //       console.log('result: ', result.toString()); 
  //       res.send(result.toString()) 
  // }); 
}); 

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));