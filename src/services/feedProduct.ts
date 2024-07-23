import { Request, Response } from "express"
import Product from '../models/product'



export const feedProduct = async(rawData: any) => { 

    try {
        for await (const data of rawData) {
            const product = new Product(data)
            const saveProduct = await product.save()
        }

    } catch (error) {
        console.log(error);
        
    }
}

