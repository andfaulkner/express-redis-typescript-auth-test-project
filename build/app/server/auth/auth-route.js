"use strict";
//************************************** THIRD-PARTY MODULES **************************************/
const express = require("express");
const util_1 = require("util");
const bodyParser = require("body-parser");
/******************************************** LOGGING *********************************************/
util_1.inspect.defaultOptions = {
    showProxy: true,
    colors: true,
    showHidden: true,
    depth: 10,
    breakLength: 120,
};
/*************************************** ATTACH MIDDLEWARES ***************************************/
let app = express();
exports.authRouter = app;
app.use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }));
/********************************************* ROUTES *********************************************/
app
    .get('/login', (req, res) => {
    res.json({ ping: 'pong', msg: 'please POST to this route only' });
})
    .post('/login', (req, res) => {
    console.log(util_1.inspect("\n\nreq.body"));
    console.log(util_1.inspect(req.body));
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    res.json({ loginAttempted: 'true', allowedIn: 'maybe' });
});
//# sourceMappingURL=auth-route.js.map