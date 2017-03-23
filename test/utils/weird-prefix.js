var webpackVersion = require("./version.js")

module.exports = (
  webpackVersion === "2"
  ? "(Emitted value instead of an instance of Error) "
  : ""
)
