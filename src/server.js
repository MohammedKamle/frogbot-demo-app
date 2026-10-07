// SAST demo: intentionally insecure handlers. DO NOT USE IN PRODUCTION.
const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { buildObject } = require("./utils");
const { render } = require("./template");
const config = require("./config");

const router = express.Router();
router.use(express.json());

// Command injection
router.get("/ping", (req, res) => {
  exec("ping -c 1 " + req.query.host, (err, stdout) => res.send(stdout));
});

// SQL injection
const db = { query: (q, cb) => cb(null, [q]) };
router.get("/user", (req, res) => {
  db.query("SELECT * FROM users WHERE name = '" + req.query.name + "'", (e, rows) => res.json(rows));
});

// Reflected XSS
router.get("/hello", (req, res) => {
  res.send("<h1>Hello " + req.query.name + "</h1>");
});

// Code injection via eval
router.post("/calc", (req, res) => {
  res.json({ result: eval(req.body.expression) });
});

// Path traversal
router.get("/file", (req, res) => {
  res.send(fs.readFileSync(path.join(__dirname, "../files", req.query.name), "utf8"));
});

// Reachable vulnerable library calls (contextual analysis)
router.post("/object", (req, res) => res.json(buildObject(req.body.paths, req.body.values)));
router.post("/render", (req, res) => res.send(render(req.body.template, req.body.data)));

// Weak hashing / insecure crypto
router.get("/hash", (req, res) => {
  res.send(require("crypto").createHash("md5").update(req.query.v || "").digest("hex"));
});

router.get("/debug", (req, res) => res.json({ region: "us-east-1", key: config.aws.accessKeyId }));

module.exports = router;
