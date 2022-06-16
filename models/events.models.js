const { Schema, model } = require(".");

const eventsSchema = new Schema({
  attendees: Number,
  name: String,
  adultsOnly: Boolean,
  description: String,
  organizers: String,
});

const Events = model("Events", eventsSchema);

module.exports = Events;
