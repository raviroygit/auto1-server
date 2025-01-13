import { app } from "./app";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import { connectDb } from "./utils/db";
import { createIndexPinecone } from "./db/pinecone";

// create server
app.listen(process.env.PORT || 8001, () => {
  console.log(`Server is connected with port ${process.env.PORT || 8001}`);
  connectDb();
  createIndexPinecone();
});
