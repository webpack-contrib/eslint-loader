"use strict";

var eslint = require("eslint")

// eslint empty filename
var TEXT = "<text>"

/**
 * linter
 *
 * @param  {String|Buffer} input JavaScript string
 * @param  {Object} config eslint configuration
 * @param  {Object} webpack webpack instance
 * @returns {void}
 */
function lint(input, config, webpack) {
  var res = config.executeOnText(input)
  // executeOnText ensure we will have res.results[0] only

  // quiet filter done now
  // eslint allow rules to be specified in the input between comments
  // so we can found warnings defined in the input itself
  if (res.warningCount && webpack.options.eslint.quiet) {
    res.warningCount = 0
    res.results[0].warningCount = 0
    res.results[0].messages = res.results[0].messages.filter(function(message) {
      return message.severity !== 1
    })
  }

  if (res.errorCount || res.warningCount) {
    var messages = webpack.options.eslint.reporter(res.results)
    if (messages.indexOf(TEXT) > -1) {
      messages = messages.split("\n").filter(function(line) {
        // drop the line that should contains filepath we do not have
        return !line.match(TEXT)
      }).join("\n")
    }

    // default behavior: emit error only if we have errors
    var emitter = res.errorCount ? webpack.emitError : webpack.emitWarning

    // force emitError or emitWarning if user want this
    if (webpack.options.eslint.emitError) {
      emitter = webpack.emitError
    }
    else if (webpack.options.eslint.emitWarning) {
      emitter = webpack.emitWarning
    }

    if (emitter) {
      emitter(messages)
      if (webpack.options.eslint.failOnError && res.errorCount) {
        throw new Error("Module failed because of a eslint error.");
      }
      else if (webpack.options.eslint.failOnWarning && res.warningCount) {
        throw new Error("Module failed because of a eslint warning.");
      }
    }
    else {
      throw new Error("Your module system doesn't support emitWarning. Update available? \n" + messages)
    }
  }
}

/**
 * webpack loader
 *
 * @param  {String|Buffer} input JavaScript string
 * @returns {String|Buffer} original input
 */
module.exports = function(input) {
  this.options.eslint = this.options.eslint || {}
  this.options.eslint.reporter = this.options.eslint.reporter || require("eslint/lib/formatters/stylish")
  this.cacheable()

  // sync loader
  var config = new eslint.CLIEngine(this.options.eslint)

  lint(input, config, this)

  // this loader do nothing
  return input
}
