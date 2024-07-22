import mongoose, { mongo } from 'mongoose';
import * as dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGO_ATLAS_URL as string

export const connectDB = async() => {
	mongoose.connect(uri)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((e) => {
		console.error("connect to MonoDB error: ",e);
	})
}
