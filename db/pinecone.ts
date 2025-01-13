import { Pinecone } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

const indexName = process.env.PINECONE_INDEX_NAME || "";

export const createIndexPinecone = async () => {
  try {
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some(
      (index) => index.name === indexName
    );
    if (!indexExists) {
      await pinecone.createIndex({
        name: indexName,
        dimension: 3072, // Replace with your model dimensions
        metric: "cosine", // Replace with your model metric
        spec: {
          serverless: {
            cloud: "aws",
            region: process.env.PINECONE_REGION || "",
          },
        },
      });
      console.log("pinecone index is created successfully");
    }
  } catch (err: any) {
    console.log("pinecone error: " + err.message);
  }
};

export type ItineraryInfo = {
  info: string;
  metaData: string;
  mobiles: string[]; // Updated to store a list of mobile numbers
};

// export type ItineraryMetadata = Omit<ItineraryInfo, "info">;

const pcIndex = pinecone.index<ItineraryInfo>(indexName);

export async function storeEmbeddings(dataToEmbed: ItineraryInfo[]) {
return new Promise(async(resolve,reject)=>{
  try{
    // await Promise.all(
    //   dataToEmbed.map(async (item, index) => {
    //     const embeddingResult = await openai.embeddings.create({
    //       model: "text-embedding-3-large",
    //       input: item.info,
    //     });
    //     const embedding = embeddingResult.data[0].embedding;
  
    //     const uniqueId = uuidv4();
  
    //     await pcIndex.upsert([
    //       {
    //         id: uniqueId,
    //         values: embedding,
    //         metadata: item
    //       },
    //     ]);
    //     resolve(true)
    //   })
    // );

  }catch(err){
    console.log('err', err)
    reject(err)
  }
})
}

export async function queryEmbeddings(question: string, mobile: string) {
  return new Promise(async (resolve, reject) => {
    try {
      // const questionEmbeddingResult = await openai.embeddings.create({
      //   model: "text-embedding-3-large",
      //   input: question,
      // });
      // const questionEmbedding = questionEmbeddingResult.data[0].embedding;

      // const queryPayload: any = {
      //   vector: questionEmbedding,
      //   topK: 1,
      //   includeMetadata: true,
      //   includeValues: true,
      // };

      // Add filter only if 'mobile' is provided
      // if (mobile) {
      //   queryPayload.filter = {
      //     mobiles: { $in: [mobile] },
      //   };
      // }

      // const queryResult = await pcIndex.query(queryPayload);
      resolve(true);
    } catch (err) {
      console.log('err', err)
      reject(err);
    }
  });
}

export async function updateMobilesByMetaData(
  metaDataValues: string[],
  newMobiles: string[]
) {
  return new Promise(async (resolve, reject) => {
    try {
      const vectorDimension = 3072;
      const dummyVector = Array(vectorDimension).fill(0);

      for (const metaDataValue of metaDataValues) {
        const queryResult = await pcIndex.query({
          vector: dummyVector,
          filter: {
            metaData: metaDataValue,
          },
          topK: 100,
          includeMetadata: true,
        });

        if (!queryResult.matches || queryResult.matches.length === 0) {
          console.log(
            `No records found with metaData containing: ${metaDataValue}`
          );
          continue;
        }

        await Promise.all(
          queryResult.matches.map(async (record) => {
            const existingMobiles = record.metadata?.mobiles || [];
            const updatedMobiles = Array.from(
              new Set([...existingMobiles, ...newMobiles])
            );

            await pcIndex.update({
              id: record.id,
              metadata: {
                ...record.metadata,
                mobiles: updatedMobiles,
              },
            });
          })
        );
      }
      resolve(true);
    } catch (err: any) {
      reject(err);
    }
  });
}
