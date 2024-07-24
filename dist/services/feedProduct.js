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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedProduct = void 0;
const product_1 = __importDefault(require("../models/product"));
const vectorize_1 = require("./vectorize");
// import { embedText } from "./vectorize";
const feedProduct = (rawData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, rawData_1, rawData_1_1;
    var _b, e_1, _c, _d;
    try {
        try {
            for (_a = true, rawData_1 = __asyncValues(rawData); rawData_1_1 = yield rawData_1.next(), _b = rawData_1_1.done, !_b; _a = true) {
                _d = rawData_1_1.value;
                _a = false;
                const data = _d;
                data['embedding'] = yield (0, vectorize_1.embedText)(`${data.name} ${data.detail}`);
                const product = new product_1.default(data);
                const saveProduct = yield product.save();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = rawData_1.return)) yield _c.call(rawData_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.feedProduct = feedProduct;
