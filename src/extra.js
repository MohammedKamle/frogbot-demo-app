// SAST demo: more intentionally insecure handlers. DO NOT USE IN PRODUCTION.
const express = require("express");
const { exec, execSync } = require("child_process");
const fs = require("fs");
const crypto = require("crypto");
const http = require("http");
const vm = require("vm");
const https = require("https");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.use(express.json());

// Open redirect
router.get("/redirect", (req, res) => {
  res.redirect(req.query.url);
});

// SSRF
router.get("/fetch", (req, res) => {
  http.get(req.query.url, (r) => r.pipe(res));
});

// Command injection via execSync + template string
router.get("/lookup", (req, res) => {
  res.send(execSync(`nslookup ${req.query.domain}`).toString());
});

// Code injection via new Function / vm
router.post("/transform", (req, res) => {
  const fn = new Function("input", req.body.code);
  res.json({ out: fn(req.body.input) });
});
router.post("/sandbox", (req, res) => {
  res.json({ out: vm.runInNewContext(req.body.code, {}) });
});

// Path traversal on write + arbitrary file read
router.post("/upload", (req, res) => {
  fs.writeFileSync("/tmp/uploads/" + req.body.filename, req.body.content);
  res.sendStatus(201);
});
router.get("/download", (req, res) => {
  res.sendFile(req.query.path);
});

// Stored/DOM-style XSS via unescaped response
router.post("/comment", (req, res) => {
  res.type("html").send("<div class='comment'>" + req.body.text + "</div>");
});

// Insecure randomness for security-sensitive token
router.get("/token", (req, res) => {
  res.json({ token: Math.random().toString(36).slice(2) });
});

// Weak crypto: DES / ECB, hardcoded key and IV
router.post("/encrypt", (req, res) => {
  const c = crypto.createCipheriv("aes-128-ecb", Buffer.from("1234567890123456"), null);
  res.send(c.update(req.body.data, "utf8", "hex") + c.final("hex"));
});
router.get("/sha1", (req, res) => {
  res.send(crypto.createHash("sha1").update(req.query.v || "").digest("hex"));
});

// JWT: hardcoded secret, 'none' algorithm accepted, no signature verification
router.get("/jwt/sign", (req, res) => {
  res.send(jwt.sign({ user: req.query.user, admin: true }, "secret"));
});
router.get("/jwt/verify", (req, res) => {
  res.json(jwt.decode(req.query.token));
});
router.get("/jwt/verify-none", (req, res) => {
  res.json(jwt.verify(req.query.token, "", { algorithms: ["none", "HS256"] }));
});

// TLS certificate validation disabled
router.get("/proxy", (req, res) => {
  https.get(req.query.url, { rejectUnauthorized: false }, (r) => r.pipe(res));
});

// ReDoS: catastrophic backtracking on user input
router.get("/validate", (req, res) => {
  const re = /^(a+)+$/;
  res.json({ ok: re.test(req.query.v || "") });
});

// Regex built from user input
router.get("/search", (req, res) => {
  const re = new RegExp(req.query.q);
  res.json({ match: re.test(req.query.text || "") });
});

// Insecure cookie settings
router.get("/login", (req, res) => {
  res.cookie("session", req.query.user, { httpOnly: false, secure: false });
  res.send("ok");
});

// Permissive CORS + verbose error leak
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
router.get("/boom", (req, res) => {
  try { JSON.parse(req.query.j); } catch (e) { res.status(500).send(e.stack); }
});

// Prototype pollution via unsafe recursive merge
function merge(target, src) {
  for (const k in src) {
    if (typeof src[k] === "object" && src[k] !== null) {
      target[k] = merge(target[k] || {}, src[k]);
    } else {
      target[k] = src[k];
    }
  }
  return target;
}
router.post("/settings", (req, res) => res.json(merge({}, req.body)));

// Unsafe deserialization-ish: eval of JSON-like input
router.post("/import", (req, res) => {
  res.json(eval("(" + req.body.data + ")"));
});

// Hardcoded credentials (secrets scanner)
const SLACK_TOKEN = "xoxb-123456789012-1234567890123-AbCdEfGhIjKlMnOpQrStUvWx";
const GITHUB_PAT = "ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789";
router.get("/integrations", (req, res) => res.json({ slack: SLACK_TOKEN.length, gh: GITHUB_PAT.length }));

module.exports = router;
