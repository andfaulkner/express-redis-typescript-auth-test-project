"use strict";
const express = require("express");
let app = express();
exports.authRouter = app;
app
    .get('/login', (req, res) => {
    res.json({ ping: 'pong', msg: 'please POST to this route only' });
})
    .post('/login', (req, res) => {
    res.json({ loginAttempted: 'true', allowedIn: 'maybe' });
});
//# sourceMappingURL=auth-route.js.map