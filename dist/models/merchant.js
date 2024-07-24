"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const merchantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    products: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }]
});
exports.default = (0, mongoose_1.model)('merchant_db', merchantSchema);
