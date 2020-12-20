const express = require("express");
const { json } = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const grapchQlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");

const app = express();

app.use(json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: grapchQlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

const PORT = 3000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.9noml.mongodb.net/events-app?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log(
      "🚀 ~ file: app.js ~ line 73 ~ mongoose.connect.then ~ connected to DATABASE "
    );

    app.listen(PORT, null, () => {
      const log = `Listening on port ${PORT}`;
      console.log("🚀 ~ file: app.js ~ line 77 ~ app.listen ~ log", log);
    });
  })
  .catch(({ message: errorMessage }) => {
    console.log(
      "🚀 ~ file: app.js ~ line 76 ~ ).then ~ errorMessage",
      errorMessage
    );
  });
