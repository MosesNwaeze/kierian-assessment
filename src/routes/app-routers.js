const express = require('express');
const performTransaction = require("../controllers/perform-transaction-controller.js");
const auditTrail = require('../controllers/audit-trail-controller.js')
const login = require('../controllers/login.js');

const router = express.Router();

router.get("/audit-trail", auditTrail);
router.get("/:amount/:walletId/:pin/:otp",performTransaction );
router.post("/login", login);


module.exports = router;
