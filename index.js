"use strict";

var eslint = require("eslint").linter
var Config = require("eslint/lib/config");
// var loaderUtils = require("loader-utils")
//
/**
 * linter
 *
 * @param  {String|Buffer} input
 * @param  {Object} config
 * @param  {Object} webpack
 */
function lint(input, config, webpack) {
  var messages = []

  eslint.verify(input, config).forEach(function eslintMessageCallback(m) {
    messages.push(
      "  " + m.message +
      "(" + m.ruleId + ")" +
      " @ line " + m.line + " column " + m.column +
      " - " +
      (m.fatal ? "fatal, " : "") +
      "severity: " + m.severity
    )
  })

  if (messages.length) {
    var message = messages.join("\n\n")
    var emitter = webpack.options.eslint.emitErrors ? webpack.emitError : webpack.emitWarning
    if (emitter) {
      emitter("eslint results in errors\n" + message)
    }
    else {
      throw new Error("Your module system doesn't support emitWarning. Update available? \n" + message)
    }
  }
}

/**
 * webpack loader
 *
 * @param  {String|Buffer} input
 * @return {String|Buffer}
 */
module.exports = function(input) {
  this.options.eslint = this.options.eslint || {}

  this.cacheable()

  // sync
  var config = new Config(this.options.eslint).getConfig()
  lint(input, config, this)
  return input
}
