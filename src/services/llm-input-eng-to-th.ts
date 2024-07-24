import { ChatOpenAI } from "@langchain/openai"
import {ChatPromptTemplate} from '@langchain/core/prompts'
import { StringOutputParser } from "@langchain/core/output_parsers";


//Translate input TH to Eng chain
export const createPromptTranslateEngtoTH = async(input: string) => {
  const model = new ChatOpenAI({
		model: "gpt-4o",
		temperature: 0.7,
		openAIApiKey: process.env.OPENAI_API_KEY,
	})

	const prompt = ChatPromptTemplate.fromMessages([
		["system", "Translate the following English text to Thai."],
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