var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');


const uploadReport = (req, res) => {
  
    const date = req.body.date;
    const text = req.body.text;
    const topicOwnerId = req.body.topicOwnerId;
    const topicId = req.body.topicId;
    const imageUrl = req.body.imageUrl;

    const data = {
        date: date,
        text: text,
        topicOwnerId: topicOwnerId,
        topicId: topicId,
        imageUrl: imageUrl
    }

    const ref = admin.db.ref(`reports/${topicId}`);
    const uid = ref.push().key;

    ref.child(uid).set(data).catch(e => {if(e) throw e});

    res.send({error: "OK"});
}

router.post("/uploadReport", uploadReport);
module.exports = router