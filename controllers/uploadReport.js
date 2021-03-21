var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');

const uploadImage = async ({image, imageName}) => {
    if (!image || !imageName) return null;
    const blob = await fetch(blobUrl).then((r) => r.blob()).catch(e => {if(e) throw e});
    const snapshot = await admin.storage.ref("report_images").child(imageName).put(blob);
    return await snapshot.ref.getDownloadURL();
}

const uploadReport = (data, topicId) => {
    const ref = admin.db.ref(`reports/${topicId}`);
    const uid = ref.push().key;

    ref.child(uid).set(data).catch(e => {if(e) throw e});
}

const uploadReportAndImage = (req, res) => {
    const date = req.body.date;
    const text = req.body.text;
    const topicOwnerId = req.body.topicOwnerId;
    const topicId = req.body.topicId;
    const image = req.body.image;
    const imageName = image.name;
  
    try {
        const url = uploadImage({
            blobUrl: URL.createObjectURL(image),
            name: imageName,
        });

        url.then((imageUrl) => {
            const data = {
                date: date,
                text: text,
                topicOwnerId: topicOwnerId,
                imageUrl: imageUrl
            }

            uploadReport(data, topicId);
        });
        res.send({error: "OK"});
    } 
    catch (e) {
        res.send({error: e})
    }
}

router.post("/uploadReport", uploadReportAndImage);
module.exports = router