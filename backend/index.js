const express = require("express");
require("./db/conn");
const cors = require("cors");
require("./router/adminRoutering");
const admin = require("./models/admin");
const customer = require("./models/customer");
const adminRouter = require("./router/adminRoutering");
const customerRouter = require("./router/customerRoutering");
const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});
app.use(cors({ origin: 'http://localhost:4200' }))
app.use(adminRouter);
app.use(customerRouter);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("success");
})