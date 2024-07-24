"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    merchant: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
    }
});
exports.default = (0, mongoose_1.model)('prodcut_dbs_ao', productSchema);
