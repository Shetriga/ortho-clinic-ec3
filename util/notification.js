const admin = require("firebase-admin");

let serviceAccount = require("../final.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

exports.sendNotification = async ({ registrationToken, body, title }) => {
  try {
    console.log("Hi");
    let result = await admin.messaging().sendToDevice(
      registrationToken,
      {
        notification: {
          title,
          body,
        },
      },
      options
    );
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};
