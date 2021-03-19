const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//Import PythonShell module. 
const {PythonShell} = require('python-shell'); 

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

let options = { 
  mode: 'text', 
  pythonOptions: ['-u'], // get print results in real-time 
  scriptPath: './python_scripts', //If you are having python_test.py script in same folder, then it's optional. 
  args: [] //An argument which can be accessed in the script using sys.argv[1] 
}; 


const myFunction = (req, res) => {
 
  const pyshell = new PythonShell("test.py", options);
  pyshell.send(JSON.stringify([1,2,3,4,5]));
  pyshell.on("message", (message) => {
    res.send(message);
  });

  pyshell.end((err) => {
    if(err) throw err;
  })
}

app.get("/", myFunction);

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));