import { CohereEmbeddings } from "@langchain/cohere";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import axios from "axios";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { getallProduct } from "../modules/products/controller";

dotenv.config();

const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
const database = client.db("mod_hackathon_db");
const collection = database.collection("prodcut_dbs_aos");

export const embedText = async (text: string) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/embeddings', {
            input: text,
            model: 'text-embedding-ada-002'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data?.data[0]?.embedding;
    } catch (error) {
        console.error(error)
        throw new Error("Failed to embed text");
    }
}


export const  embeddingProduct = async () => {
    const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
    const namespace = "mod_hackathon_db.prodcut_dbs_aos";
    const [dbName, collectionName] = namespace.split(".");
    const collection = client.db(dbName).collection(collectionName);

    try {

        // Get all products
        const products = await getallProduct()

        if(!products) {
            return
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
            
        const productfilter = products?.map((product) => {
            return `{ name: '${product.name}', detail: '${product.detail}', category: '${product.category}'}`
        })
        const productsId = products?.map((product) => {
            return {
                id: product._id.toString()
            }
        })
            //vectorstore
        const vectorStore = await MongoDBAtlasVectorSearch.fromTexts(
            productfilter as any,
            productsId as any,
            new OpenAIEmbeddings({ model: "text-embedding-ada-002", apiKey: process.env.OPENAI_API_KEY }),
            {
                collection,
                indexName: "v2search_index", 
                textKey: "detail", 
                embeddingKey: "embedding", 
            }
        )      

    } catch (error) {   
        console.log(error);
    }
}



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
