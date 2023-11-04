const fs = require("fs");

exports.deleteFile = (filePath) => {
  fs.unlinkSync(filePath);
};
