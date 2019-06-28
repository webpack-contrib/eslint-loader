function CLIEngine() {}

var formatter = function(results) {
  return JSON.stringify(results);
};

CLIEngine.prototype.getFormatter = function() {
  return formatter;
};

CLIEngine.prototype.executeOnText = function() {
  return {
    results: [
      {
        filePath: "",
        messages: [
          {
            ruleId: "no-undef",
            severity: 2,
            message: "Fake error",
            line: 1,
            column: 11,
            nodeType: "Identifier",
            source: "var foo = stuff"
          }
        ],
        errorCount: 2,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        source: ""
      }
    ],
    errorCount: 2,
    warningCount: 0,
    fixableErrorCount: 0,
    fixableWarningCount: 0
  };
};

module.exports = {
  CLIEngine: CLIEngine
};
