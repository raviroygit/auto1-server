import axios from "axios";
import { sampleProducts } from "../utils/data";
import OpenAI from "openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { SubCategory } from "../src/models/subcategory.model";
import { Category } from "../src/models/category.model";
require("dotenv").config();

console.log('process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY)
const openai = new OpenAI({
  // baseURL:
  //   "https://af1x9kw192svovky.us-east-1.aws.endpoints.huggingface.cloud/v1",
  // apiKey: "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",
  apiKey: process.env.OPENAI_API_KEY || "",
});

const query = async (
  history: { role: string; content: string }[],
  input: any
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const findCategoryPrompt = await Category.findOne({
        name: input.data.category_name,
      });

      console.log('input', input)

      const catPrompt = findCategoryPrompt?.prompt;

      const findSampleFile = await SubCategory.findOne({
        name: input.data.subcategory_name,
      }).populate("files");

      const subCatPrompt = findSampleFile?.prompt;
      console.log('subCatPrompt', subCatPrompt)

      let sysPrompt = "";
      findSampleFile?.files.forEach((file: any) => {
        sysPrompt = sysPrompt + `${file.name}: \n  ${file.text}\n`;
        // console.log('file',file.name, file.text)
      });
      // console.log('sysPrompt', sysPrompt)
      // console.log('findSampleFile', findSampleFile)
      const userPrompt = `user input:
      ${JSON.stringify(input)}
      `;

      const assistantPrompt = `
You are an experienced copywriter with decades of experience writing meaningful copy for the Automotive parts. You understand the US automotive market very well and know the nuances and lingo they use while referring to automotive products.  you know IN and OUT of everything about them including various brands, what their technical specifications mean etc. You will be given partial input of text. Looking at the Golden samples given in the context. Your task is to generate a complete output that exactly matches the tone, style, language, and writing format of the golden samples


Title: When provided with a product name, generate few alternative names separated by comma.


Marketing Description: Write a 250 words marketing description that uses the exact product name provided. The description must be around 250 words and no fewer than 200 words, while matching the tone, grammar, style, and structure of the Golden samples.
Features: Based on the input provided and the marketing description generated in Part 2, write the Features & Benefits section in the same format and tone as the golden samples.


Attributes:  Based on the input provided and the marketing description generated in Part 2 and 3, generate product attributes. 

Review: Based on the input reviews provided, create a short summary of these reviews as a 50 words short paragraph. Generate a balanced summary starting with positives.
 Your job is to provide results in a valid JSON format, ensuring user-friendly and simple responses. Below is an example structure:

 Give the response in this format:
{
      "request_id": "",
      "data": {
        "category_name": "",
        "subcategory_name": "",
        "user_input": {
          "title": " ",
          "company_name": "",
          "description": "",
          "features":[] "",
          "attributes": [
            
          ],
          "reviews": ""
        }
      },
    }
 
Your task:
Generate a valid JSON response similar to the example above based on the user's query. Provide only the valid JSON response in a structured format, without additional text or explanation.

`;

      const messages: any = [
        { role: "system", content: sysPrompt },
        // { role: "assistant", content: catPrompt },
        // { role: "assistant", content: subCatPrompt },
        { role: "system", content: subCatPrompt },
        { role: "user", content: userPrompt },
      ];

      const stream: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        stream: false,
      });

      console.log(
        "stream.choices[0]?.message.content",
        stream.choices[0]?.message.content
      );
      resolve(stream.choices[0]?.message.content);
      // for await (const chunk of stream) {
      //   if(chunk.choices[0]?.delta?.content){
      //     console.log( chunk.choices[0]?.delta?.content)

      //   }
      //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
      // }

      // const response = await axios.post(
      //   "https://af1x9kw192svovky.us-east-1.aws.endpoints.huggingface.cloud",
      //   {
      //     inputs: messages,
      //     parameters: {
      //       stream: false,
      //     },
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer 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`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // const result = response.data;
      // resolve(result || "");
    } catch (error) {
      console.error("Error querying the Hugging Face API:", error);
      reject(error);
    }
  });
};

export default query;
