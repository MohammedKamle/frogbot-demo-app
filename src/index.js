const express = require("express");
const app = express();

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(process.env.PORT || 3000, () => console.log("listening"));
