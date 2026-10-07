// Contextual analysis demo (APPLICABLE): lodash zipObjectDeep is called with
// user-controlled keys -> CVE-2020-8203 (prototype pollution) is reachable.
const _ = require("lodash");

function buildObject(paths, values) {
  return _.zipObjectDeep(paths, values);
}

// minimist is imported and parsed with user-supplied args (prototype pollution)
const minimist = require("minimist");
function parseArgs(argv) {
  return minimist(argv);
}

module.exports = { buildObject, parseArgs };
