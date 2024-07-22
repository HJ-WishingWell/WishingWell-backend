import { createVectorStore } from '../../services/vectorize';
import { maxiMalmarginalRelevanceSearch } from '../../services/search'
import { Request, Response } from 'express';

export const createVectorStoreController = async(req: Request, res: Response) => {
    try {
        await createVectorStore()
        res.status(201).json('vectorize done')
    } catch (error) {
        console.log(error);
        
    }
}

export const maxMalmarginalRelevanceSearchController = async(req: Request, res: Response) => {
    try {
        const vectorStore = await maxiMalmarginalRelevanceSearch()
        res.status(201).json({searchDone: vectorStore})
    } catch (error) {
        console.log(error);   
    }
}