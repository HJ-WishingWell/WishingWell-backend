import { ChatOpenAI } from "@langchain/openai"
import {ChatPromptTemplate} from '@langchain/core/prompts'
import { StringOutputParser } from "@langchain/core/output_parsers";

//Translate input TH to Eng chain
export const createPromptFocusProduct= async(input: string) => {
  const model = new ChatOpenAI({
		model: "gpt-4o",
		temperature: 0.3,
		openAIApiKey: process.env.OPENAI_API_KEY,
	})

	const prompt = ChatPromptTemplate.fromMessages([
		["human", "ฉันอยากได้กระทะ ให้บอกแค่สินค้า"],
		['system', 'กระทะ'],
		["human", "ฉันอยากได้ต้นไม้ ให้บอกแค่สินค้า"],
		['system', 'ต้นไม้'],
		["human", "ต้องการเสื้อยืด ให้บอกแค่สินค้า"],
		['system', 'เสื้อยืด'],
		["human", "หากางเกงขายาว ให้บอกแค่สินค้า"],
		['system', 'กางเกงขายาว'],
		["human", input + 'ให้บอกแค่สินค้า'],
	])
	const result = await createChain(model, prompt, input)
	return result
}

//Translate input TH to Eng chain
export const createPromptTranslateTHtoENG = async(input: string) => {
  const model = new ChatOpenAI({
		model: "gpt-4o",
		temperature: 0.7,
		openAIApiKey: process.env.OPENAI_API_KEY,
	})

	const prompt = ChatPromptTemplate.fromMessages([
		["system", "Translate the following Thai text to English."],
		["human", "{input}"],
	])

	const result = await createChain(model, prompt, input)
	return result
}

export const createChain = async(model: any, prompt: any, input: any) => {

	//parser
	const parser = new StringOutputParser()

	//create chain
	const chain = await prompt.pipe(model).pipe(parser)

	//call chain
	const response = await chain.invoke({input})

	return response
}