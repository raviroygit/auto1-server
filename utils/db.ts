import mongoose from "mongoose";
require("dotenv").config();

const dbUrl: string = process.env.MONGODB_URL || "";

export const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`Database connected with ${data.connection.host}`);
      // Itinerary.init();
      // Conversation.init();
    });
  } catch (err: any) {
    console.log(err.message);
    setTimeout(connectDb, 5000);
  }
};
