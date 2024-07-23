import { Request, Response } from "express"
import Product from '../models/product'
import { embedText } from "./vectorize";


export const feedProduct = async(rawData: any) => { 

    try {
        for await (const data of rawData) {
            data['embedding'] = await embedText(`${data.name} ${data.detail}`);
            const product = new Product(data)
            const saveProduct = await product.save()
        }

    } catch (error) {
        console.log(error);
        
    }
}

