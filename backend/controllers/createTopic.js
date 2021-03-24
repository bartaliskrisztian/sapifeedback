var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');


// POST request for creating a topic
const createTopic = (req, res) => {
    const date = req.body.date;
    const topicName = req.body.topicName;
    const userId = req.body.userId;
    const host = req.body.host;

    const ref = admin.db.ref(`topics/${userId}`);
    const uid = ref.push().key;
    const reportUrl = `${host}/#/report/${userId}/${uid}`;

    const newTopic = {
        date: date,
        topicName: topicName,
        reportUrl: reportUrl,
    };

    ref
    .child(uid)
    .set(newTopic).then(res.send({error: "OK"})).catch(res.send({error: "Error: could not create topic"}));
}

router.post("/createTopic", createTopic);
module.exports = router