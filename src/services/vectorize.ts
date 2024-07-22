import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { CohereEmbeddings } from "@langchain/cohere";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

export const createVectorStore = async() => {
    const client = new MongoClient(process.env.MONGO_ATLAS_URL || "");
    const namespace = "mod_hackathon_db.prodcut_vectorstore_db";
    const [dbName, collectionName] = namespace.split(".");
    const collection = client.db(dbName).collection(collectionName);

    //vectorstore
    const vectorStore = await MongoDBAtlasVectorSearch.fromTexts(
        [
					`{"name":"ต้นไม้ตั้งโต๊ะทำงาน เลือกต้นไม้ได้ พร้อมปลูก สวนจิ๋ว ต้นไม้ฟอกอากาศ ต้นไม้มงคล2","price":{"$numberInt":"199"},"detail":"ต้นไม้มงคล ต้นไม้ฟอกอากาศ พร้อมปลูกลงกระถางขนาด 4 นิ้ว ค่ะ 1 ชุดจะประกอบไปด้วย ต้นไม้ 1 ต้น + กระถางพร้อมจานรอง 4 นิ้ว + ตุ๊กตา 1 + เสาไฟ 1 + รั้วไม้ 1 + หินโรย","category":"จัดโต๊ะคอม","amount":{"$numberInt":"10"}}`,
					`{"name":"คอมไฟคริสมาสต์ของตกแต่งตั้งโต๊ะ","price":{"$numberInt":"190"},"detail":"คอมไฟคริสมาสต์ของตกแต่งตั้งโต๊ะ"}`
				],
        [{ id: '669e16ed024d527082dd4598' }, {id: '669e1f190d929875d0a2127c'}],
        new CohereEmbeddings({ model: "embed-english-v3.0", apiKey: process.env.COHERE_API_KEY || "" }),
    {
        collection,
        indexName: "default", // The name of the Atlas search index. Defaults to "default"
        textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
        embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
    })
    const assignedIds = await vectorStore.addDocuments([
        { pageContent: "upsertable", metadata: {} },
    ]);

    const upsertedDocs = [{ pageContent: "overwritten", metadata: {} }];

		await vectorStore.addDocuments(upsertedDocs, { ids: assignedIds });

		await client.close();
}
