const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://treewatch-f6df4.firebaseio.com",
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.sendPacket = functions.https.onRequest((req, res) => {
  let data = req.body;
  let docID = "node-" + data.sender_id;
  data.timestamp = Date.now();

  const update = (newData) =>
    admin
      .firestore()
      .collection("node-data")
      .doc(docID)
      .update({ log: admin.firestore.FieldValue.arrayUnion(newData) })
      .then((response) => {
        res.status(200).send({ success: true });
        return;
      })
      .catch((error) => {
        res.status(400).send({ error: error, success: false });
        return;
      });

  const newDoc = (newData) =>
    admin
      .firestore()
      .collection("node-data")
      .doc(docID)
      .set({ log: [newData] })
      .then((response) => {
        res.status(200).send({ success: true });
        return;
      })
      .catch((error) => {
        res.status(400).send({ error: error, success: false });
        return;
      });
  admin
    .firestore()
    .collection("node-data")
    .doc(docID)
    .get()
    .then((resp) => {
      // parse data object
      let readings = data.readings;
      let splitter = readings.split(" ");
      data["temp"] = parseFloat(splitter[0]);
      data["humidity"] = parseFloat(splitter[1]);
      data["co2"] = parseFloat(splitter[2]);
      if (resp.exists) {
        return update(data);
      } else {
        return newDoc(data);
      }
    })
    .catch((err) => {
      return res.status(400).send({ error: err, success: false });
    });
});

exports.testSend = functions.https.onRequest((req, res) => {
  payload = { data: { yuh: "uj" } };
  return admin
    .messaging()
    .sendToDevice(
      "f0mUzcC7lTodmd3iYL1e5_:APA91bFWAZ6bKKP9UjcTntfJESt64Oae8cJggrmuFGMlDLxCT7xo0EBWQbrYqPDIzGstO4QzDuBb6dGQ_zC2_up3zD6Oq_lQ2ArJDOKq18qeH8CQum5Ji7YnRO1j8J7_tvX-vb5E4dxg",
      payload
    )
    .then(function (response) {
      res.send("success");
      return;
    })
    .catch((err) => {
      res.send("error " + err);
      return;
    });
});

exports.listenForUpdates = functions.firestore
  .document("node-data/node-1")
  .onUpdate((change, context) => {
    var payload = {
      notification: {
        node: "node-1",
      },
    };
    // push a message
    return admin
      .messaging()
      .sendToDevice(
        "f0mUzcC7lTodmd3iYL1e5_:APA91bFWAZ6bKKP9UjcTntfJESt64Oae8cJggrmuFGMlDLxCT7xo0EBWQbrYqPDIzGstO4QzDuBb6dGQ_zC2_up3zD6Oq_lQ2ArJDOKq18qeH8CQum5Ji7YnRO1j8J7_tvX-vb5E4dxg",
        payload
      )
      .then(function (response) {
        return;
      })
      .catch(() => {
        return;
      });
  });

exports.listenForWrites = functions.firestore
  .document("node-data/node-1")
  .onWrite((change, context) => {
    var payload = {
      notification: {
        node: "node-1",
      },
    };
    // push a message
    return admin
      .messaging()
      .sendToDevice(
        "f0mUzcC7lTodmd3iYL1e5_:APA91bFWAZ6bKKP9UjcTntfJESt64Oae8cJggrmuFGMlDLxCT7xo0EBWQbrYqPDIzGstO4QzDuBb6dGQ_zC2_up3zD6Oq_lQ2ArJDOKq18qeH8CQum5Ji7YnRO1j8J7_tvX-vb5E4dxg",
        payload
      )
      .then(function (response) {
        console.log(response)
        return;
      })
      .catch((err) => {
        console.log(err)

        return;
      });
  });
