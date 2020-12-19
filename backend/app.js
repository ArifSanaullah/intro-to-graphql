const express = require("express");
const { json } = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");

const app = express();

app.use(json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
            events: [Event!]!
      }

      type RootMutation {
            createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
      `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find();
          return events;
        } catch (error) {
          console.log("🚀 ~ file: app.js ~ line 50 ~ events: ~ error", error);
          throw error;
        }
      },
      createEvent: async ({
        eventInput: { title, description, price, date },
      }) => {
        try {
          const newEvent = await Event.create({
            title,
            description,
            price: +price,
            date: new Date(date),
          });

          return newEvent;
        } catch (error) {
          console.log(
            "🚀 ~ file: app.js ~ line 63 ~ createEvent: ~ error",
            error
          );
          throw error;
        }
      },
    },
    graphiql: true,
  })
);

const PORT = 3000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.9noml.mongodb.net/events-app?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
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
