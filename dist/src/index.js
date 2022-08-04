"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("../schema/schema"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("../config/database"));
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
// connectDatabase();
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.default,
    graphiql: process.env.NODE_ENV === "development",
}));
(0, database_1.default)()
    .then(() => app.listen(port, () => console.log(`🚀 Server ready on port ${port}`)))
    .catch((err) => console.log("Error: ", err));
//# sourceMappingURL=index.js.map