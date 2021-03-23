var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');

const getTopicUrl = (req, res) => {
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  const ref = admin.db.ref(`topics/${userId}/${topicId}/reportUrl`)
  
  let url = null;
  ref.on(
    "value",
    (snapshot) => {
      if (snapshot.val()) {
        url = snapshot.val();
      }
      res.send({result: url})
    }
  );
};

const activateTopic = (req, res) => {
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  const ref = admin.db.ref(`topics/${userId}/${topicId}`) 

  ref.update({
    isArchived: null,
  }).catch(e => {
    res.send({error: e});
    return;
  });
  res.send({error: "OK"});
};

const archiveTopic = (req, res) => {
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  const ref = admin.db.ref(`topics/${userId}/${topicId}`) 

  ref.update({
    isArchived: "true",
  }).catch(e => {
    res.send({error: e});
    return;
  });

  res.send({error: "OK"});
};

const getUserTopics = (req, res) => {
   const userId = req.params.userId;
   const ref = admin.db.ref(`topics/${userId}`);

   ref.on("value", (snapshot) => {
     res.io.emit("asd", {result: snapshot.val()});
    });
}

router.get("/:userId", getUserTopics);
router.get("/getTopicUrl/:userId/:topicId", getTopicUrl);
router.get("/archiveTopic/:userId/:topicId", archiveTopic);
router.get("/activateTopic/:userId/:topicId", activateTopic);

module.exports = router