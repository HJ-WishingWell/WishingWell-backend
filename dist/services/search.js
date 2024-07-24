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
exports.searchQuery = exports.searchSimilarProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
const vectorize_1 = require("./vectorize");
const searchSimilarProducts = (query, maxPrice, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('url: ', process.env.MONGO_ATLAS_URL);
        // const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
        // await client.connect();
        // const database = client.db("mod_hackathon_db");
        // const collection = database.collection("prodcut_dbs_aos");
        //  const aaa = await collection.find({});
        console.log(query, maxPrice, category);
        const queryVector = yield (0, vectorize_1.embedText)(query);
        const agg = [
            {
                '$vectorSearch': {
                    'index': 'v2search_index_ao',
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
                '$project': {
                    'embedding': 0,
                    'score': {
                        '$meta': 'vectorSearchScore'
                    }
                }
            }
        ];
        // run pipeline
        const result = product_1.default.aggregate(agg);
        // const vectorStore = new MongoDBAtlasVectorSearch(
        //   new OpenAIEmbeddings({ model: "text-embedding-ada-002", apiKey: process.env.OPENAI_API_KEY }),
        //   {
        //     collection,
        //     indexName: "v2search_index_ao", // The name of the Atlas search index. Defaults to "default"
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
exports.searchSimilarProducts = searchSimilarProducts;
const searchQuery = (query, maxPrice, category) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, exports.searchSimilarProducts)(query, maxPrice, category);
    console.log('ผลลัพธ์ที่ค้นหาได้:');
    results === null || results === void 0 ? void 0 : results.forEach(result => {
        console.log(result);
    });
    return results !== null && results !== void 0 ? results : [];
});
exports.searchQuery = searchQuery;
// export const maxiMalmarginalRelevanceSearch = async() => {
//     const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
//     const namespace = "mod_hackathon_db.prodcut_dbs_ao";
//     const [dbName, collectionName] = namespace.split(".");
//     const collection = client.db(dbName).collection(collectionName);
//     //vectorstore
//     const vectorStore = new MongoDBAtlasVectorSearch(
//       new CohereEmbeddings({ model: "embed-english-v3.0" }),
//       {
//         collection,
//         indexName: "vsearch_index", // The name of the Atlas search index. Defaults to "default"
//         textKey: "detail", // The name of the collection field containing the raw content. Defaults to "text"
//         embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
//       }
//     );
//     const resultOne = await vectorStore.similaritySearch("I but new personal computer, so I want to decorate my desk ", 1);
//     // const resultOne = await vectorStore.similaritySearch("I got some field about 1 acre so I want to make it to be a cactus garden", 1);
// console.log(resultOne);
// const resultOne = await vectorStore.maxMarginalRelevanceSearch("I got some field about 1 acre so I want to make it to be a garden with cactus", {
//   k: 10,
//   fetchK: 20, // The number of documents to return on initial fetch
// });
// console.log(resultOne);
// Using MMR in a vector store retriever
// const retriever = await vectorStore.asRetriever({
//   searchType: "mmr",
//   searchKwargs: {
//     fetchK: 20,
//     lambda: 0.1,
//   },
// });
// const retrieverOutput = await retriever.invoke("I got some field about 1 acre so I want to make it to be a garden with cactus");
// console.log(retrieverOutput);
// return resultOne
