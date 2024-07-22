import { Router } from 'express'
import { createProduct, getProduct} from '../modules/products/controller'

const router = Router()

router.post('/product', createProduct)
router.get('/product', getProduct)
export default router