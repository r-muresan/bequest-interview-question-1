"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var crypto_js_1 = require("crypto-js");
var PORT = 8080;
var app = (0, express_1.default)();
var database = { data: "Hello", version: 1 };
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", function (req, res) {
    var requestedVersion = req.query.version
        ? parseInt(req.query.version, 10)
        : 1;
    // Return data and current version
    res.json({ data: database.data, version: requestedVersion });
});
app.post("/", function (req, res) {
    var newData = req.body.data || "";
    var receivedVersion = req.body.version || 1;
    var checksum = req.body.checksum || "";
    // Verify data integrity
    if ((0, crypto_js_1.SHA256)(newData).toString() !== checksum) {
        return res.status(400).send("Data integrity check failed");
    }
    // Verify version consistency
    if (receivedVersion !== database.version) {
        return res.status(400).send("Version mismatch");
    }
    // Increment version and update data
    database.data = newData;
    res.json({ version: database.version });
    database.version += 1;
});
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
