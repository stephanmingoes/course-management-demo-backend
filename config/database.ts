import mongoose from "mongoose";
require("dotenv").config();

const mongo_uri: string = process.env.MONGO_URI as string;
export default async function connectDatabase(): Promise<void> {
  const connection = await mongoose.connect(mongo_uri);
  console.log(`MongoDB Connection ${connection.connection.host}`);
}
