import Product from '../models/product';
import { createPromptTranslateTHtoENG } from './llm-input-th-to-eng';
import { embedText } from "./vectorize";
// import { embedText } from "./vectorize";


export const feedProduct = async(rawData: any) => { 

    try {
        for await (const data of rawData) {
            //translate product_name th to eng
            const product_name_eng = await createPromptTranslateTHtoENG(data.name)
            const product_detail_eng = await createPromptTranslateTHtoENG(data.detail)
            const product_cateofry_eng = await createPromptTranslateTHtoENG(data.category)

            //embedding with eng version
            data['embedding'] = await embedText(`${data.name_eng} ${data.detail_eng}`);

            //add eng content
            data.name_eng = product_name_eng
            data.detail_eng = product_detail_eng
            data.category_eng = product_cateofry_eng

            const product = new Product(data)
            await product.save()
        }

    } catch (error) {
        console.log(error);
        
    }
}

