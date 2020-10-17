const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

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
  admin
    .firestore()
    .collection("node-data")
    .doc(docID)
    .update({ log: admin.firestore.FieldValue.arrayUnion(data) })
    .then((response) => {
      res.status(200).send({ success: true });
      return;
    })
    .catch((error) => {
      res.status(400).send({ data: data, success: false });
      return;
    });
});
