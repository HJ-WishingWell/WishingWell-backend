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
exports.embeddingProduct = exports.embedText = void 0;
const mongodb_1 = require("@langchain/mongodb");
const openai_1 = require("@langchain/openai");
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const mongodb_2 = require("mongodb");
const controller_1 = require("../modules/products/controller");
dotenv.config();
const client = new mongodb_2.MongoClient(process.env.MONGO_ATLAS_URL || "");
const database = client.db("mod_hackathon_db");
const collection = database.collection("prodcut_dbs_aos");
const embedText = (text) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.post('https://api.openai.com/v1/embeddings', {
            input: text,
            model: 'text-embedding-ada-002'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data[0]) === null || _b === void 0 ? void 0 : _b.embedding;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to embed text");
    }
});
exports.embedText = embedText;
const embeddingProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_2.MongoClient(process.env.MONGO_ATLAS_URL || "");
    const namespace = "mod_hackathon_db.prodcut_dbs_aos";
    const [dbName, collectionName] = namespace.split(".");
    const collection = client.db(dbName).collection(collectionName);
    try {
        // Get all products
        const products = yield (0, controller_1.getallProduct)();
        if (!products) {
            return;
        }
        // const textVector = await embedText(`${product.name} ${product.detail}`);
        const dbConfig = {
            collection: collection,
            indexName: "vector_index", // The name of the Atlas search index to use.
            textKey: "text", // Field name for the raw text content. Defaults to "text".
            embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
        };
        // const docs = await collection.find({}).toArray();
        // const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(products , new OpenAIEmbeddings(), dbConfig)
        // const updatedProduct = { ...product, embedding: textVector };
        // await insertEmbedding(product._id, textVector);
        const productfilter = products === null || products === void 0 ? void 0 : products.map((product) => {
            return `{ name: '${product.name}', detail: '${product.detail}', category: '${product.category}'}`;
        });
        const productsId = products === null || products === void 0 ? void 0 : products.map((product) => {
            return {
                id: product._id.toString()
            };
        });
        //vectorstore
        const vectorStore = yield mongodb_1.MongoDBAtlasVectorSearch.fromTexts(productfilter, productsId, new openai_1.OpenAIEmbeddings({ model: "text-embedding-ada-002", apiKey: process.env.OPENAI_API_KEY }), {
            collection,
            indexName: "v2search_index",
            textKey: "detail",
            embeddingKey: "embedding",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.embeddingProduct = embeddingProduct;
// // export const createVectorStore = async() => {
// //     const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
// //     const namespace = "mod_hackathon_db.prodcut_dbs_aos";
// //     const [dbName, collectionName] = namespace.split(".");
// //     const collection = client.db(dbName).collection(collectionName);
// //     const getproducts = await getallProduct()
// //     const products = getproducts?.map((product) => {
// //         return `{ name: '${product.name}', detail: '${product.detail}', category: '${product.category}'}`
// //     })
// //     const productsId = getproducts?.map((product) => {
// //         return {
// //             id: product._id.toString()
// //         }
// //     })
//     /
// //     //vectorstore
// //     const vectorStore = await MongoDBAtlasVectorSearch.fromTexts(
// //         [
// //             `{"name":"christmas lamp","detail":"christmas lamp for decoration your desk","category":"decorate compute desk"}`,
// //             `{"name":"Wooden Bookshelf","detail":"White wooden bookshlf, Brown wooden bookshelf, Black wooden bookshelf","category":"decorate compute desk"}`,
// //             `{"name":"Monstera plastic plant","detail":"Fake plant, plastic plant","category":"decorate compute desk"}`,
// //             `{"name":"Agricultural fertilizer","detail":"fertilizer for growing plants","category":"house and graden"}`,
// //             `{"name":"Mini Cactus","detail":"Cactus size mini from India","category":"house and graden"}`,
// //             `{"name":"Plant shovel","detail":"shovel tool for plant ","category":"house and graden"}`
// //         ],
// //         // [{ id: '669e16ed024d527082dd4598' }, {id: '669e1f190d929875d0a2127c'}],
// //         productsId as any,
// //         new CohereEmbeddings({ model: "embed-english-v3.0", apiKey: process.env.COHERE_API_KEY || "" }),
// //     {
// //         collection,
// //         indexName: "vsearch_index", // The name of the Atlas search index. Defaults to "default"
// //         textKey: "detail", // The name of the collection field containing the raw content. Defaults to "text"
// //         embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
// //     })
// // }
//     // const assignedIds = await vectorStore.addDocuments([
//     //     { pageContent: "upsertable", metadata: {} },
//     // ]);
//     // const upsertedDocs = [{ pageContent: "overwritten", metadata: {} }];
// 	// await vectorStore.addDocuments(upsertedDocs, { ids: assignedIds });
// }
