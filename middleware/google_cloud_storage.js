const { Storage } = require("@google-cloud/storage");
const path = require("path");

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    ".././ortho-clinic-79d90-ae3d09296194.json"
  ),
  projectId: "ortho-clinic-79d90",
});

const orthoBucket = gc.bucket("ortho_bucket");

module.exports = orthoBucket;
