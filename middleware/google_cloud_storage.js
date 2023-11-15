const { Storage } = require("@google-cloud/storage");
const path = require("path");

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    ".././ortho-latest-a3954-3bdddbd10c4e.json"
  ),
  projectId: "ortho-clinic-79d90",
});

const orthoBucket = gc.bucket("ortho_bucket_latest");

module.exports = orthoBucket;
