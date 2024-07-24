import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { CohereEmbeddings } from "@langchain/cohere";
import { MongoClient } from "mongodb";
import { StringOutputParser } from "@langchain/core/output_parsers";
// import { embedText } from "./vectorize";
// import product from "../models/product";
import { OpenAIEmbeddings } from "@langchain/openai";

const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
const database = client.db("mod_hackathon_db");
const collection = database.collection("prodcut_dbs_aos");

export const searchSimilarProducts =  async(query: any, maxPrice: number, category: string) => {
  try {
      // const dbConfig = {  
      //   collection: collection,
      //   indexName: "vector_index", // The name of the Atlas search index to use.
      //   textKey: "text", // Field name for the raw text content. Defaults to "text".
      //   embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
      // };
      // const docs = await collection.find({}).toArray();
      // const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(docs, new OpenAIEmbeddings(), dbConfig)

      const vectorStore = new MongoDBAtlasVectorSearch(
        new OpenAIEmbeddings({ model: "text-embedding-ada-002", apiKey: process.env.OPENAI_API_KEY }),
        {
          collection,
          indexName: "v2search_index_ao", // The name of the Atlas search index. Defaults to "default"
          textKey: "detail", // The name of the collection field containing the raw content. Defaults to "text"
          embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
        }
      );
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
      
      const retrieverOutput= await retrieverSearch(vectorStore, query, category, maxPrice)

      return retrieverOutput;
  } catch (error) {
      console.log(error);
  } 
}

export const retrieverSearch = async(vectorStore: any,query: string, category: string, maxPrice: number) => {
  // MMR
  const retriever = await vectorStore.asRetriever({
    filter:{
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

  const retrieverOutput = await retriever.invoke(query);
  console.log(retrieverOutput);
  return retrieverOutput
}

export const searchQuery = async(query: string, maxPrice: number ,category: string) => {
    const results = await searchSimilarProducts(query, maxPrice, category);

    console.log('ผลลัพธ์ที่ค้นหาได้:');
    results?.forEach((result: any) => {
        console.log(result);
    });
    return results ?? [];
}

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


