var webpackVersion = require("./version")
module.exports = webpackVersion < 4 ? "loaders" : "rules"
