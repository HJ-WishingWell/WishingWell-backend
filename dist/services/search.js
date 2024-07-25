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
exports.searchQuery = exports.hybridSearchProduct = void 0;
const product_1 = __importDefault(require("../models/product"));
const vectorize_1 = require("./vectorize");
const llm_input_th_to_eng_1 = require("./llm-input-th-to-eng");
var vector_penalty = 1;
var full_text_penalty = 10;
const hybridSearchProduct = (query, maxPrice, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //translate TH input to Eng
        const engQuery = yield (0, llm_input_th_to_eng_1.createPromptTranslateTHtoENG)(query);
        const queryVector = yield (0, vectorize_1.embedText)(engQuery);
        console.log("🚀 ~ hybridSearchProduct ~ engQuery:", engQuery);
        const agg = [
            {
                '$vectorSearch': {
                    'index': 'vector_product_search_index',
                    'path': 'embedding',
                    'queryVector': queryVector,
                    // 'exact': true, 
                    'limit': 1000,
                    numCandidates: 1536
                }
            },
            {
                "$match": {
                    price: { $lte: maxPrice },
                    category: category
                }
            },
            {
                "$group": {
                    "_id": null,
                    "docs": { "$push": "$$ROOT" },
                }
            },
            {
                "$unwind": {
                    "path": "$docs",
                    "includeArrayIndex": "rank"
                }
            },
            {
                "$addFields": {
                    "vs_score": {
                        "$divide": [1.0, { "$add": ["$rank", vector_penalty, 1] }]
                    },
                }
            },
            {
                "$project": {
                    "vs_score": 1,
                    "rank": 1,
                    "_id": "$docs._id",
                    "name": "$docs.name",
                    "detail": "$docs.detail",
                    "image": "$docs.image",
                    "price": "$docs.price",
                    "category": "$docs.category",
                    "amount": "$docs.amount",
                    "merchant": "$docs.merchant",
                    "detail_eng": "$docs.detail_eng",
                }
            },
            {
                "$unionWith": {
                    "coll": "prodcut_dbs_ao_v2",
                    "pipeline": [
                        {
                            $search: {
                                index: "al_search_product_index",
                                text: {
                                    query: engQuery,
                                    path: {
                                        wildcard: "*"
                                    }
                                }
                            }
                        },
                        {
                            "$limit": 20
                        },
                        {
                            "$group": {
                                "_id": null,
                                "docs": { "$push": "$$ROOT" },
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$docs",
                                "includeArrayIndex": "rank"
                            }
                        },
                        {
                            "$addFields": {
                                "fts_score": {
                                    "$divide": [
                                        1.0,
                                        { "$add": ["$rank", full_text_penalty, 1] }
                                    ]
                                }
                            }
                        },
                        {
                            "$project": {
                                "fts_score": 1,
                                "_id": "$docs._id",
                                "_pid": "$docs._id",
                                "name": "$docs.name",
                                "detail": "$docs.detail",
                                "image": "$docs.image",
                                "price": "$docs.price",
                                "category": "$docs.category",
                                "amount": "$docs.amount",
                                "merchant": "$docs.merchant",
                                "detail_eng": "$docs.detail_eng",
                            }
                        }
                    ]
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    // "_id": "$name",
                    "name": { "$first": "$name" },
                    "detail": { "$first": "$detail" },
                    "image": { "$first": "$image" },
                    "price": { "$first": "$price" },
                    "category": { "$first": "$category" },
                    "amount": { "$first": "$amount" },
                    "merchant": { "$first": "$merchant" },
                    "vs_score": { "$max": "$vs_score" },
                    "fts_score": { "$max": "$fts_score" }
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "_pid": 1,
                    // "detail": 1,
                    "detail": 1,
                    "image": 1,
                    "price": 1,
                    "category": 1,
                    "amount": 1,
                    "merchant": 1,
                    "vs_score": { "$ifNull": ["$vs_score", 0] },
                    "fts_score": { "$ifNull": ["$fts_score", 0] }
                }
            },
            {
                "$project": {
                    "score": { "$add": ["$fts_score", "$vs_score"] },
                    "_id": 1,
                    "name": 1,
                    "detail": 1,
                    "image": 1,
                    "price": 1,
                    "category": 1,
                    "amount": 1,
                    "merchant": 1,
                    // "detail": 1,
                    "vs_score": 1,
                    "fts_score": 1
                }
            },
            {
                "$match": {
                    "vs_score": { "$gt": 0 },
                    "fts_score": { "$gt": 0 },
                }
            },
            { "$sort": { "score": -1 } },
            { "$limit": 10 }
        ];
        // run pipeline
        const result = product_1.default.aggregate(agg);
        // const vectorStore = new MongoDBAtlasVectorSearch(
        //   new OpenAIEmbeddings({ model: "text-embedding-ada-002", apiKey: process.env.OPENAI_API_KEY }),
        //   {
        //     collection,
        //     indexName: "vector_product_search_index", // The name of the Atlas search index. Defaults to "default"
        //     textKey: "detail", // The name of the collection field containing the raw content. Defaults to "text"
        //     embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
        //   }
        // );
        // console.log({
        //   query,
        //   maxPrice,
        //   category
        // });
        // // const result = await vectorStore.similaritySearch(query, 10
        // // , {
        // //   preFilter: {
        // //     price: { $lte: maxPrice },
        // //     category: category
        // //   }}
        // // )
        // const retriever = await vectorStore.asRetriever({
        //   k: 4,
        //   searchType: "mmr",
        //   searchKwargs: {
        //     fetchK: 20,
        //     lambda: 0.1,
        //   },
        //   filter: {
        //     price: { $lte: maxPrice },
        //     category: category
        //   }
        // });
        // const result = await retriever.invoke(query);
        console.log(result);
        return result;
    }
    catch (error) {
        console.log(error);
    }
});
exports.hybridSearchProduct = hybridSearchProduct;
const searchQuery = (query, maxPrice, category) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, exports.hybridSearchProduct)(query, maxPrice, category);
    results === null || results === void 0 ? void 0 : results.forEach(result => {
        console.log(result);
    });
    return results !== null && results !== void 0 ? results : [];
});
exports.searchQuery = searchQuery;
// // //
// // // export const maxiMalmarginalRelevanceSearch = async() => {
// // //     const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
// // //     const namespace = "mod_hackathon_db.prodcut_dbs_ao";
// //     const [dbName, collectionName] = namespace.split(".");
// //     const collection = client.db(dbName).collection(collectionName);
// //     //vectorstore
// //     const vectorStore = new MongoDBAtlasVectorSearch(
// //       new CohereEmbeddings({ model: "embed-english-v3.0" }),
// //       {
// //         collection,
// //         indexName: "vsearch_index", // The name of the Atlas search index. Defaults to "default"
// //         textKey: "detail", // The name of the collection field containing the raw content. Defaults to "text"
// //         embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
// //       }
// //     );
// //     const resultOne = await vectorStore.similaritySearch("I but new personal computer, so I want to decorate my desk ", 1);
// //     // const resultOne = await vectorStore.similaritySearch("I got some field about 1 acre so I want to make it to be a cactus garden", 1);
// //     console.log(resultOne);
// //     const resultOne = await vectorStore.maxMarginalRelevanceSearch("I got some field about 1 acre so I want to make it to be a garden with cactus", {
// //       k: 10,
// //       fetchK: 20, // The number of documents to return on initial fetch
// //     });
// //     console.log(resultOne);
// //     Using MMR in a vector store retriever
// //     const retriever = await vectorStore.asRetriever({
// //       searchType: "mmr",
// //       searchKwargs: {
// //         fetchK: 20,
// //
//          lambda: 0.1,
// //       },
// //     });
// //     const retrieverOutput = await retriever.invoke("I got some field about 1 acre so I want to make it to be a garden with cactus");
// //     console.log(retrieverOutput);
// //     return resultOne
// //
