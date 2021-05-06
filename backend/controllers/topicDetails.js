var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');

const getTopicReports = (req, res) => {
  // getting the parameters sent from the client side
    const topicId = req.params.topicId;
    const ref = admin.db.ref(`reports/${topicId}`);
    
    // when there is a change between these reports, we send them to the client with the help of a websocket 
    ref.on("value", (snapshot) => {
        res.send({result: snapshot.val()});
    });
}

const getTopicDetails = (req, res) => {
  // getting the parameters sent from the client side
    const topicId = req.params.topicId;

    const ref = admin.db.ref(`topics/${topicId}`);

    ref.on("value", (snapshot) => {
        // res.io.emit("getTopicDetails", {result: snapshot.val()}) // sending response to client
        res.send({result: snapshot.val()});
    });

}

router.get("/:topicId/reports", getTopicReports)
router.get("/:topicId/details", getTopicDetails)

module.exports = router