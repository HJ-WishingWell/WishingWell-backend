import { Router } from 'express'
import { createVectorStoreController, maxMalmarginalRelevanceSearchController } from '../modules/llm/controller'
const router = Router() 

router.post('/vectorize', createVectorStoreController)
router.post('/search', maxMalmarginalRelevanceSearchController)

export default router