"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const mongo_1 = require("./config/mongo");
//router
const merchant_1 = __importDefault(require("./routers/merchant"));
const product_1 = __importDefault(require("./routers/product"));
const llm_1 = __importDefault(require("./routers/llm"));
const feedProduct_1 = require("./services/feedProduct");
const vectorize_1 = require("./services/vectorize");
const search_1 = require("./services/search");
dotenv.config();
const app = (0, express_1.default)();
const port = 4455;
app.use(express_1.default.json());
app.use('/api', merchant_1.default);
app.use('/api', product_1.default);
app.use('/api', llm_1.default);
app.post('/feed-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rawData = req.body;
    yield (0, feedProduct_1.feedProduct)(rawData);
    res.status(201).json('feed done');
}));
app.post('/vectorize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, vectorize_1.embeddingProduct)();
    res.status(201).json('embed done');
}));
app.post('/search-query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, maxPrice, category } = req.body;
    const result = yield (0, search_1.searchQuery)(query, maxPrice, category);
    res.status(201).json(result);
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_1.connectDB)();
    console.log(`Server is running on http://localhost:${port}`);
}));
