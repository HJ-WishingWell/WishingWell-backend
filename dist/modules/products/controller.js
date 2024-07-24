"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertEmbedding = exports.getallProduct = exports.getProduct = exports.createProduct = void 0;
const product_1 = __importDefault(require("../../models/product"));
const mongodb_1 = require("mongodb");
// import { createVectorStore } from "../../services/vectorize"
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, detail, category, amount, merchant } = req.body;
    try {
        const product = new product_1.default({ name, price, detail, category, amount, merchant });
        const saveProduct = yield product.save();
        // await createVectorStore(saveProduct)
        res.status(201).json(saveProduct);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
exports.createProduct = createProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_1.default.find();
        res.json(product);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
exports.getProduct = getProduct;
const getallProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find();
        return products;
    }
    catch (error) {
        console.log(error);
    }
});
exports.getallProduct = getallProduct;
const insertEmbedding = (productId, textVector) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('insertEmbedding => ', productId, textVector);
    yield product_1.default.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(productId) }, { $set: { embedding: textVector } });
});
exports.insertEmbedding = insertEmbedding;
