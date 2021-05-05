var express = require('express')
var router = express.Router()
const admin = require('../firebase_db');

const getTopicUrl = (req, res) => {
  // getting the parameters sent from the client side
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  const ref = admin.db.ref(`topics/${topicId}/reportUrl`)
  
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
  // getting the parameters sent from the client side
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  const ref1 = admin.db.ref(`users/${userId}/topics/${topicId}`);
  const ref2 = admin.db.ref(`topics/${topicId}`);

  ref1.update({
    isArchived: null,
  });

  ref2.update({
    isArchived: null,
  }).catch(e => {
    res.send({error: e});
    return;
  });
  res.send({error: "OK"});
};

const archiveTopic = (req, res) => {
  // getting the parameters sent from the client side
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  const ref1 = admin.db.ref(`users/${userId}/topics/${topicId}`);
  const ref2 = admin.db.ref(`topics/${topicId}`);

  ref1.update({
    isArchived: "true",
  });

  ref2.update({
    isArchived: "true",
  }).catch(e => {
    res.send({error: e});
    return;
  });

  res.send({error: "OK"});
};

const getUserTopics = (req, res) => {
  // getting the parameters sent from the client side
   const userId = req.params.userId;

   const ref = admin.db.ref(`users/${userId}/topics`);
   // when there is a change between the user's topics, we send them again with the help of a websocket 
   ref.on("value", (snapshot) => {
     if(snapshot.val()) {
      res.io.emit("getUserTopics", {result: snapshot.val()});
     }
     else {
      res.io.emit("getUserTopics", {result: []});
     }
    });
}

router.get("/:userId", getUserTopics);
router.get("/getTopicUrl/:topicId", getTopicUrl);
router.get("/archiveTopic/:topicId", archiveTopic);
router.get("/activateTopic/:topicId", activateTopic);

module.exports = router