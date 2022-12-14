import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "../schema/schema";
import cors from "cors";
import connectDatabase from "../config/database";

require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// connectDatabase();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

connectDatabase()
  .then(() =>
    app.listen(port, () => console.log(`🚀 Server ready on port ${port}`))
  )
  .catch((err) => console.log("Error: ", err));
