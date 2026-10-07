# Frogbot Demo App

Showcases [JFrog Frogbot](https://docs.jfrog-applications.jfrog.io/jfrog-applications/frogbot) scanning
pull requests on GitHub.

## What Frogbot reports on a PR
| Capability | Where it is demonstrated |
|---|---|
| SCA – vulnerable dependencies | `package.json` (lodash, handlebars, minimist, moment) |
| Contextual analysis (applicable vs. not applicable CVEs) | `src/template.js`, `src/utils.js` |
| SAST | `src/server.js` (command injection, SQL injection, XSS, eval, path traversal) |
| Secrets detection | `src/config.js` (fake credentials) |

All "vulnerable" code and credentials in the PR are **fake and for demonstration only**.

## Setup
1. Repo secrets: `JF_URL`, `JF_ACCESS_TOKEN` (Actions → Secrets).
2. Workflow: `.github/workflows/frogbot-scan-pull-request.yml` (must exist on the default branch, as it uses `pull_request_target`).
3. Open a PR → Frogbot comments with the findings.
