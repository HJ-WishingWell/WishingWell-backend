import { Request, Response } from "express"
import Product from '../../models/product'
import { ObjectId } from "mongodb"
// import { createVectorStore } from "../../services/vectorize"

export const createProduct = async(req: Request, res: Response) => {
    const {name, price, detail, category, amount, merchant} = req.body
    try {
        const product = new Product({name, price, detail, category, amount, merchant})
        const saveProduct = await product.save()
        // await createVectorStore(saveProduct)
        res.status(201).json(saveProduct)
    } catch (error: any) {
        console.log(error);
        res.status(400).json(error)
    }
}

export const getProduct = async(req: Request, res: Response) => {
    try {
        const product = await Product.find()
        res.json(product)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}


export const getallProduct = async() => {   
    try {
        const products = await Product.find()
        return products
    } catch (error) {
        console.log(error);
    }
}

export const insertEmbedding = async(productId: any, textVector: any) => {
    console.log('insertEmbedding => ', productId, textVector)
    await Product.findByIdAndUpdate({ _id: new ObjectId(productId) }, { $set: { embedding: textVector} });
}
