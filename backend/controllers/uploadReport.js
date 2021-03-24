var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');

// handlig POST request for uploading a report (the image is uploaded on the client side)
const uploadReport = (req, res) => {
    // getting the parameters sent from the client side
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

    const ref = admin.db.ref(`reports/${topicId}`); // db reference for the actual topic
    const uid = ref.push().key; // getting new unique key

    ref.child(uid).set(data).catch(e => {if(e) throw e}); // uploading

    res.send({error: "OK"}); // sending response to client
}

router.post("/uploadReport", uploadReport);
module.exports = router