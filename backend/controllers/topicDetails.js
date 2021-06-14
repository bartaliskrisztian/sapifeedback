var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');

const getTopicReports = (req, res) => {
  // getting the parameters sent from the client side
    const topicId = req.params.topicId;
    const ref = admin.db.ref(`reports/${topicId}`);
    
    // when there is a change between these reports, we send them to the client with the help of a websocket 
    ref.on("value", (snapshot) => {
      res.io.emit("getTopicFeedbacks", {result: snapshot.val()}) 
      res.send({result: snapshot.val()});
    });
}

const getTopicDetails = (req, res) => {
  // getting the parameters sent from the client side
    const topicId = req.params.topicId;

    const ref = admin.db.ref(`topics/${topicId}`);
    const feedbackRef = admin.db.ref(`topics/${topicId}/reportsUploaded`);

    feedbackRef.on("value", (snapshot) => {
      ref.once("value", (snapshot) => {
        res.io.emit("getTopicDetails", {result: snapshot.val()}) 
      });
    });

    ref.on("value", (snapshot) => {
      // sending response to client
      res.send({result: snapshot.val()});
    });
}

const deleteFeedback = (req, res) => {
  const topicId = req.params.topicId;
  const feedbackId = req.params.feedbackId;

  const topicRef = admin.db.ref(`topics/${topicId}/reportsUploaded`);
  const ref = admin.db.ref(`reports/${topicId}/${feedbackId}`);
  ref.remove();

  topicRef.transaction((current_value) => {
    if (current_value) {
      if (current_value >= 1) {
          return current_value - 1;
      }
    }
    return current_value;
  });

  res.send({result: "OK"});
}

router.get("/:topicId/reports", getTopicReports)
router.get("/:topicId/details", getTopicDetails)
router.get("/:topicId/deleteFeedback/:feedbackId", deleteFeedback)

module.exports = router