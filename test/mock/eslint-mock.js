function CLIEngine() {

}

CLIEngine.prototype.executeOnText = function() {
  return {
    warningCount: 0,
    errorCount: 1,
    results: [{
      messages: [
        {
          message: "Fake error",
        },
      ],
    }],
  }
}

module.exports = {
  CLIEngine: CLIEngine,
}
