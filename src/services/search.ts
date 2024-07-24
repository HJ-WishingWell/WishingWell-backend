import { PipelineStage } from "mongoose";
import product from "../models/product";
import { embedText } from "./vectorize";

var vector_penalty = 1;
var full_text_penalty = 10;

export const hybridSearchProduct =  async(query: any, maxPrice: number, category: string) => {
  try {
    const queryVector = await embedText(query);
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
        "$group": {
          "_id": null,
          "docs": {"$push": "$$ROOT"},
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
            "$divide": [1.0, {"$add": ["$rank", vector_penalty, 1]}]
          },
        }
      },
     
      {
        "$project": {
          "vs_score": 1,
          "rank":1,
          "_id": "$docs._id", 
          "name": "$docs.name",
          "detail": "$docs.detail",
        }
      },
      {
        "$unionWith": {
          "coll": "product_dbs_aos",
          "pipeline": [
            {
              "$search": {
                "index": "atlas_search_product_index",
                "phrase": {
                  "query": query,
                  "path": ["name", "detail"]
                }
              }
            }, 
            {
              "$limit": 20
            }, 
            {
              "$group": {
                "_id": null,
                "docs": {"$push": "$$ROOT"},
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
                    {"$add": ["$rank", full_text_penalty, 1]}
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
              }
            }
          ]
        }
      },
      {
        "$group": {
          // "_id": "$_id",
          "_id": "$_id",
          // "detail": "$detail",
          "vs_score": {"$max": "$vs_score"},
          "fts_score": {"$max": "$fts_score"}
        }
      },
      {
        "$project": {
          "_id": 1,
          "name": 1,
          "_pid": 1,
          // "detail": 1,
          "vs_score": {"$ifNull": ["$vs_score", 0]},
          "fts_score": {"$ifNull": ["$fts_score", 0]}
        }
      },
      {
        "$project": {
          "score": {"$add": ["$fts_score", "$vs_score"]},
          "_id": 1,
          "name": 1,
          // "detail": 1,
          "vs_score": 1,
          "fts_score": 1
        }
      },
      {"$sort": {"score": -1}},
      {"$limit": 10}
    ] as PipelineStage[];
    // run pipeline
    const result = product.aggregate(agg);
     
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
  } catch (error) {
      console.log(error);
  } 
}


export const searchQuery = async(query: string, maxPrice: number ,category: string) => {
    const results = await hybridSearchProduct(query, maxPrice, category);
    results?.forEach(result => {
        console.log(result);
    });
    return results ?? [];
}

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

