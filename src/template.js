// Contextual analysis demo (APPLICABLE): Handlebars.compile is called on
// user-supplied templates -> handlebars template-injection / RCE CVEs are reachable.
const Handlebars = require("handlebars");

function render(templateSource, data) {
  return Handlebars.compile(templateSource)(data);
}

// moment is required but only a harmless helper is used (likely NOT APPLICABLE
// for the ReDoS in moment's locale/duration parsing).
const moment = require("moment");
const today = () => moment().format("YYYY-MM-DD");

module.exports = { render, today };
