import { Schema, model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    detail: string;
    price: number;
    category: string;
    amount: number;
    merchant: {
        type: Schema.Types.ObjectId,
        ref: 'Merchant'
    }
}

const productSchema  = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    detail: {
        type: String,
        required: true
    }, 
    category: {
        type: String,
        required: true
    },  
    amount: {
        type: Number,
        required: true
    },  
    merchant: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }   
})

export default model<IProduct>('product_db', productSchema);