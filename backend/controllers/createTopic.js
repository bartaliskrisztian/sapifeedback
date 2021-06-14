var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');


// POST request for creating a topic
const createTopic = (req, res) => {
    const date = req.body.date;
    const topicName = req.body.topicName;
    const userId = req.body.userId;

    const ref1 = admin.db.ref(`topics`);
    const ref2 = admin.db.ref(`users/${userId}/topics`);

    const uid = ref1.push().key;
    const feedbackUrl = `giveFeedback/${uid}`;

    const newTopic = {
        date: date,
        topicName: topicName,
        feedbackUrl: feedbackUrl,
    };

    ref1
    .child(uid)
    .set(newTopic);

    ref2
    .child(uid)
    .set(newTopic).then(res.send({error: "OK"})).catch(res.send({error: "Error: could not create topic"}));
}

router.post("/createTopic", createTopic);
module.exports = router