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
  }).then(res.send({error: "OK"})).catch(e => res.send({error: e}));
};

const archiveTopic = (req, res) => {
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  const ref = admin.db.ref(`topics/${userId}/${topicId}`) 

  ref.update({
    isArchived: "true",
  }).then(res.send({error: "OK"})).catch(e => res.send({error: e}));
};

const getUserTopics = (req, res) => {
   const userId = req.params.userId;
   const ref = admin.db.ref(`topics/${userId}`);
   console.log("asd");

   ref.on("value", (snapshot) => {
     res.send({result: snapshot.val()});
    });
}

router.get("/userTopics/:userId", getUserTopics);
router.get("/userTopics/getTopicUrl/:userId/:topicId", getTopicUrl);
router.get("/userTopics/archiveTopic/:userId/:topicId", archiveTopic);
router.get("/userTopics/activateTopic/:userId/:topicId", activateTopic);

module.exports = router