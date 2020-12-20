const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const Event = require("../../models/event");

const user = async (userId) => {
  try {
    const user = await User.findById(userId);

    return {
      ...user._doc,
      password: null,
      createdEvents: async () => await getEvents(user.createdEvents),
    };
  } catch (error) {
    console.log("🚀 ~ file: app.js ~ user ~ line 20 ~ user ~ error", error);
    throw error;
  }
};

const getEvents = async (eventIds) => {
  const events = await Event.find({ _id: { $in: eventIds } });

  return Promise.all(
    events.map(async (event) => ({
      ...event._doc,
      creator: await user(event.creator),
      date: new Date(event._doc.date).toISOString(),
    }))
  );
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return Promise.all(
        events.map(async (event) => {
          return {
            ...event._doc,
            creator: await user(event.creator),
            date: new Date(event._doc.date).toISOString(),
          };
        })
      ).then((events) => {
        return events;
      });
    } catch (error) {
      console.log("🚀 ~ file: app.js ~ line 50 ~ events: ~ error", error);
      throw error;
    }
  },
  createEvent: async ({ eventInput: { title, description, price, date } }) => {
    try {
      const creator = await user("5fdef5b9715537c527a55fe4");

      // check if user exists against provided id
      if (!creator) {
        throw new Error("User does not exists");
      } else {
        const newEvent = await Event.create({
          title,
          description,
          price: +price,
          date: new Date(date),
          creator,
        });

        // add event to user's created events
        await User.findByIdAndUpdate("5fdef5b9715537c527a55fe4", {
          $push: { createdEvents: newEvent._id },
        });

        return newEvent;
      }
    } catch (error) {
      console.log("🚀 ~ file: app.js ~ line 63 ~ createEvent: ~ error", error);
      throw error;
    }
  },
  createUser: async ({ userInput }) => {
    try {
      const existingUser = await User.findOne({ email: userInput.email });

      if (existingUser) {
        throw new Error("User already exists with provided details");
      } else {
        const { email, _id } = await User.create({
          ...userInput,
          password: await bcrypt.hash(userInput.password, 12),
        });

        return { email, _id };
      }
    } catch (error) {
      console.log("🚀 ~ file: app.js ~ line 99 ~ createUser: ~ error", error);
      throw error;
    }
  },
};
