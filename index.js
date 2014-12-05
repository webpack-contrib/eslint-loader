"use strict";

var assign = require("object-assign")
var eslint = require("eslint").linter
var eslintConfig = require("eslint/conf/eslint.json")
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

  // merge default config + user config
  config = {
    env: assign({}, eslintConfig.env, config.env),
    rules: assign({}, eslintConfig.rules, config.rules)
  }

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
 * configuration loader
 *
 * @param {Object}   webpack
 * @param {Function} callback
 */
function loadRcConfig(webpack, callback) {
  var fs = require("fs")
  var RcLoader = require("rcloader")
  var rcLoader = new RcLoader(".eslintrc", null, {
    loader: function(path) { return path }
  })
  var stripJsonComments = require("strip-json-comments")

  if (typeof callback !== "function") {
    var path = rcLoader.for(this.resourcePath)
    if (typeof path !== "string") {
      // no .rc found
      return {}
    }
    else {
      webpack.addDependency(path)
      var file = fs.readFileSync(path, "utf8")
      return JSON.parse(stripJsonComments(file))
    }
  }
  else {
    rcLoader.for(webpack.resourcePath, function rcLoaderCallback(err, path) {
      if (err) {
        throw err
      }

      if (typeof path !== "string") {
        // no .rc found
        return callback(null, {})
      }

      webpack.addDependency(path)
      fs.readFile(path, "utf8", function loadRcConfigFileCallback(err, file) {
        var options

        if (!err) {
          try {
            options = JSON.parse(stripJsonComments(file))
          }
          catch (e) {
            err = e
          }
        }
        callback(err, options)
      })
    })
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
  var callback = this.async()

    // sync
  if (!callback) {
    var config = loadRcConfig(this)
    lint(input, config, this)
    return input
  }

  // async
  loadRcConfig(this, function loadRcConfigCallback(err, config) {
    if (err) {
      return callback(err)
    }

    try {
      lint(input, config, this)
    }
    catch (e) {
      return callback(e)
    }
    callback(null, input)
  }.bind(this))
}
