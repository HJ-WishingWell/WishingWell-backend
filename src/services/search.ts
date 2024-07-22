import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { CohereEmbeddings } from "@langchain/cohere";
import { MongoClient } from "mongodb";
import { StringOutputParser } from "@langchain/core/output_parsers";


export const maxiMalmarginalRelevanceSearch = async() => {
    const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
    const namespace = "mod_hackathon_db.prodcut_vectorstore_db";
    const [dbName, collectionName] = namespace.split(".");
    const collection = client.db(dbName).collection(collectionName);
    
    //vectorstore
    const vectorStore = new MongoDBAtlasVectorSearch(
      new CohereEmbeddings({ model: "embed-english-v3.0" }),
      {
        collection,
        indexName: "vsearch_index", // The name of the Atlas search index. Defaults to "default"
        textKey: "detail", // The name of the collection field containing the raw content. Defaults to "text"
        embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
      }
    );

    // const resultOne = await vectorStore.similaritySearch("I but new personal computer, so I want to decorate my desk ", 1);
    // const resultOne = await vectorStore.similaritySearch("I got some field about 1 acre so I want to make it to be a cactus garden", 1);
    // console.log(resultOne);
    
    const resultOne = await vectorStore.maxMarginalRelevanceSearch("I got some field about 1 acre so I want to make it to be a garden with cactus", {
      k: 3,
      fetchK: 20, // The number of documents to return on initial fetch
    });
    console.log(resultOne);

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
    return resultOne
}

