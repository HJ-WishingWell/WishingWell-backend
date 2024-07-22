import { Schema, model } from "mongoose";

interface IMerchant extends Document {
    name: string;
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}

const merchantSchema  = new Schema<IMerchant>({
    name: {
        type: String,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }]
})

export default model<IMerchant>('merchant_db', merchantSchema);