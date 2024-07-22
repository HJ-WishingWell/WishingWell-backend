import { Router } from 'express'
import {createMerchant, getMerchant} from '../modules/merchant/controller'

const router = Router()

router.post('/merchant', createMerchant)
router.get('/merchant', getMerchant)

export default router