

import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";

dotenv.config();

export const createChain = async () => {
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 100,
})

const messages = [
    new SystemMessage("Translate the following from English into Italian"),
    new HumanMessage("Hello! ")
]

const result = await model.invoke(messages)
    const parser = new StringOutputParser();
    const log = await parser.invoke(result)
return log
}