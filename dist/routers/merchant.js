"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../modules/merchant/controller");
const router = (0, express_1.Router)();
router.post('/merchant', controller_1.createMerchant);
router.get('/merchant', controller_1.getMerchant);
exports.default = router;
