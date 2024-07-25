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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchQuery = exports.retrieverSearch = exports.searchSimilarProducts = void 0;
const mongodb_1 = require("@langchain/mongodb");
const mongodb_2 = require("mongodb");
// import { embedText } from "./vectorize";
// import product from "../models/product";
const openai_1 = require("@langchain/openai");
const client = new mongodb_2.MongoClient(process.env.MONGO_ATLAS_URL || "");
const database = client.db("mod_hackathon_db");
const collection = database.collection("prodcut_dbs_aos");
const searchSimilarProducts = (query, maxPrice, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const dbConfig = {  
        //   collection: collection,
        //   indexName: "vector_index", // The name of the Atlas search index to use.
        //   textKey: "text", // Field name for the raw text content. Defaults to "text".
        //   embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
        // };
        // const docs = await collection.find({}).toArray();
        // const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(docs, new OpenAIEmbeddings(), dbConfig)
        const vectorStore = new mongodb_1.MongoDBAtlasVectorSearch(new openai_1.OpenAIEmbeddings({ model: "text-embedding-ada-002", apiKey: process.env.OPENAI_API_KEY }), {
            collection,
            indexName: "v2search_index_ao", // The name of the Atlas search index. Defaults to "default"
            textKey: "detail", // The name of the collection field containing the raw content. Defaults to "text"
            embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
        });
        // const retrieverOutput = await vectorStore.similaritySearch(query, 10
        // , {
        //   preFilter: {
        //     // price: { $lte: maxPrice },
        //     // category: category
        //   }})
        // console.log(retrieverOutput);
        // MMR
        // const retriever = await vectorStore.asRetriever({
        //   k: 10,
        //   searchType: "mmr",
        //   searchKwargs: {
        //     fetchK: 20,
        //     lambda: 0.1,
        //   },
        // });
        // const retrieverOutput = await retriever.invoke(query);
        // console.log(retrieverOutput);
        const retrieverOutput = yield (0, exports.retrieverSearch)(vectorStore, query, category, maxPrice);
        return retrieverOutput;
    }
    catch (error) {
        console.log(error);
    }
});
exports.searchSimilarProducts = searchSimilarProducts;
const retrieverSearch = (vectorStore, query, category, maxPrice) => __awaiter(void 0, void 0, void 0, function* () {
    // MMR
    const retriever = yield vectorStore.asRetriever({
        filter: {
            preFilter: {
                price: { $lte: maxPrice },
                category
            }
        },
        k: 10,
        searchType: "mmr",
        searchKwargs: {
            fetchK: 20,
            lambda: 0.1,
        },
    });
    const retrieverOutput = yield retriever.invoke(query);
    console.log(retrieverOutput);
    return retrieverOutput;
});
exports.retrieverSearch = retrieverSearch;
const searchQuery = (query, maxPrice, category) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, exports.searchSimilarProducts)(query, maxPrice, category);
    console.log('ผลลัพธ์ที่ค้นหาได้:');
    results === null || results === void 0 ? void 0 : results.forEach((result) => {
        console.log(result);
    });
    return results !== null && results !== void 0 ? results : [];
});
exports.searchQuery = searchQuery;
// export const maxiMalmarginalRelevanceSearch = async() => {
//     const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
//     const namespace = "mod_hackathon_db.prodcut_vectorstore_db";
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
