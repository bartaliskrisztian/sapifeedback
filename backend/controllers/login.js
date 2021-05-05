var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');


// POST request for logging in
const tryToLogin = (req, res) => {
    const userId = req.body.googleId;
    const ref = admin.db.ref(`users/${userId}`);

    ref.once("value", (snapshot) => {
       if(snapshot.exists()) {
            res.send({result: "Logged in successfully."});
       }
       else {
            const email = req.body.email;
            const name = req.body.name;
        
            const newUser = {
                userId: userId,
                email: email,
                name: name
            };

            ref.set(newUser).then(res.send({result: "Successful registration."})).catch(res.send({res: "Error."}));
       }
    });
}

router.post("/", tryToLogin);
module.exports = router