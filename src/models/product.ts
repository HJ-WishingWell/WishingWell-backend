import { Schema, model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    name_eng: string
    detail: string;
    detail_eng: string
    price: number;
    category: string;
    category_eng: string
    amount: number;
    image: string;
    merchant: string
    embedding:[number]
}

const productSchema  = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    name_eng: {
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
    detail_eng: {
        type: String,
        required: true
    }, 
    category: {
        type: String,
        required: true
    },  
    category_eng: {
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
    embedding: {
        type: [Number],
    }

})

export default model<IProduct>('prodcut_dbs_ao_v2', productSchema);