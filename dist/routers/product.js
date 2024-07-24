"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../modules/products/controller");
const router = (0, express_1.Router)();
router.post('/product', controller_1.createProduct);
router.get('/product', controller_1.getProduct);
exports.default = router;
