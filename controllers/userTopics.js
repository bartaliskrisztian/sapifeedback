var express = require('express')
var router = express.Router()
const db = require('../firebase_db');

const getUserTopics = (req, res) => {
   const userId = req.params.userId;
   const ref = db.ref(`topics/${userId}`);

   ref.on("value", (snapshot) => {
     res.send({result: snapshot.val()});
    });
}

router.get("/getUserTopics/:userId", getUserTopics);
module.exports = router