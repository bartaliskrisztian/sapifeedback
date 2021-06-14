var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');

// handlig POST request for uploading a report (the image is uploaded on the client side)
const uploadReport = (req, res) => {
    // getting the parameters sent from the client side
    const text = req.body.text;
    const topicId = req.body.topicId;
    const imageUrl = req.body.imageUrl;
    const date = new Date().toLocaleDateString();

    

    const reportRef = admin.db.ref(`reports/${topicId}`); // db reference for the actual topic
    const topicRef = admin.db.ref(`topics/${topicId}/reportsUploaded`);

    const uid = reportRef.push().key; // getting new unique key

    const data = {
        date: date,
        text: text,
        topicId: topicId,
        imageUrl: imageUrl,
        feedbackId: uid
    }

    reportRef.child(uid).set(data).catch(e => {if(e) throw e}); // uploading

    topicRef.transaction((current_value) => {
        return (current_value || 0) + 1;
    });

    res.send({error: "OK"}); // sending response to client
}

router.post("/uploadReport", uploadReport);
module.exports = router