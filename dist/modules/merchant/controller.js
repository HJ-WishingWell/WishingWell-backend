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
exports.getMerchant = exports.createMerchant = void 0;
const merchant_1 = __importDefault(require("../../models/merchant"));
const createMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const merchant = new merchant_1.default({ name });
        const saveMerchant = yield merchant.save();
        res.status(201).json(saveMerchant);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
exports.createMerchant = createMerchant;
const getMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merchant = yield merchant_1.default.find();
        res.json(merchant);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
exports.getMerchant = getMerchant;
