const queryString = require("querystring");

const myBodyParser = (req, res, next) => {
  req.on("data", (chunk) => {
    const contentType = req.headers["content-type"];
    if (contentType === "application/x-www-form-urlencoded") {
      req.body = queryString.parse(chunk.toString());
    } else if (contentType === "application/json") {
      req.body = JSON.parse(chunk.toString());
    }
  });

  req.on("end", () => {
    next();
  });
};

module.exports = myBodyParser;
