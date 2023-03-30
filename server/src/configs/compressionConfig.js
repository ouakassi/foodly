const compression = require("compression");
const compressionConfig = {
  level: 6,
  threshold: 100 * 1000,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
};

module.exports = compressionConfig;
