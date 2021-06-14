var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');


const deleteTopicFromDB = (req, res) => {
    const userId = req.params.userId;
    const topicId = req.params.topicId;

    const feedbacksRef = admin.db.ref(`feedbacks/${topicId}`); 
    const topicRef = admin.db.ref(`topics/${topicId}`);
    const userTopicsRef = admin.db.ref(`users/${userId}/topics/${topicId}`);

    feedbacksRef.set(null);
    topicRef.set(null);
    userTopicsRef.set(null);

    res.send({result: "OK"}); // sending response to client
}

router.get("/:userId/:topicId", deleteTopicFromDB);
module.exports = router