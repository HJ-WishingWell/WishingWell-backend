import { Schema, model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    detail: string;
    price: number;
    category: string;
    amount: number;
    image: string;
    merchant: string
    // embedding:[number]
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
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    // embedding: {
    //     type: [Number],
    // }

})

export default model<IProduct>('product_db', productSchema);