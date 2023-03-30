const fs = require("fs");
const path = require("path");

const option = fs.createWriteStream(
  path.join(__dirname, "../", "logs", "appLogs.log"),
  {
    flags: "a",
  }
);

module.exports = option;
