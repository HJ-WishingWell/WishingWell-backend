import express from 'express';
import { createChain } from './llm';
import * as dotenv from "dotenv";
import { connectDB } from './config/mongo'

//router
import merchantRouter from './routers/merchant';
import productRouter from './routers/product';
import llmRouter from './routers/llm';



dotenv.config();


const app = express();
const port = 4455;

app.use(express.json());


app.use('/api', merchantRouter)
app.use('/api', productRouter)
app.use('/api', llmRouter)


app.listen(port, async() => {
  await connectDB()
  console.log(`Server is running on http://localhost:${port}`);
});
