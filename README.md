# Prerequisite

Before you start this part, make sure you have read [**part 1**](https://github.com/tutorial-point/koa-server-tutorial) of this tutorial series as we're gonna be starting from there.

In this tutorial, we'll be connecting a **`Mongo database`** to our Koa JS server.

# KOA MongoDB Server

Before we start let's make sure we have [**`MongoDB`**](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/) installed.

Run the following command to check:

```
mongod --version
```

## Setup

**`MongoDB`** is non-relational database, meaning each object we post into our database does not need to have the same keys. But **`Mongoose`** allows us to set up schemas which makes our types more strict.

In this tutorial we will be using [**`Mongoose`**](https://mongoosejs.com/). So let's start by installing **`Mongoose`**:

```
npm i mongoose
```

## Models

Once **`mongoose`** is installed, let's create a directory named **`models`** and our first model.

Run the following commands:

```bash
mkdir models
touch models/index.js models/event.models.js
```

These commands will create the following:

1. A directory named **`models`**
2. A file titled **`index.js`**
3. A file titled **`event.models.js`**

Let's first add the following code to **`index.js`**:

```javascript
const mongoose = require("mongoose");

const settings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect("mongodb://localhost:27017/database", settings);

module.exports = mongoose;
```

This file will connect us to our **`MongoDB`** database.

### Creating our model

Now let's add the following to **`event.models.js`**:

```javascript
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
```

These are the types we've just created:

1. **`name`** - this will be a string representing the name of the event.
2. **`adultsOnly`** - this will be a boolean field.
3. **`attendees`** - this will be a number representing the number of attendees.
4. **`description`** - this will also be a string field.

## Updating our controllers

We should now change the import in our **`event.controllers.js`** file to:

```bash
const events = require('../models/events.models');
```

### Post Request

Let's update the **`postEvent`** controller in our **`event.controllers.js`** with the following code:

```javascript
const postEvent = async (ctx) => {
  try {
    await Events.create(ctx.request.body);
    ctx.body = "Event Created!";
    ctx.status = 201;
  } catch (e) {
    console.log(err);
    ctx.status = 500;
    throw err;
  }
};
```

The post request takes the request body and creates an object in our MongoDB database.

- A successful request returns **`'Event Created!'`**,
- An unsuccessful request returns a status **500 error**.

Try posting the following code this endpoint: [**`http://127.0.0.1:8000/post_event`**](http://127.0.0.1:8000/post_event)

```json
[
  {
    "name": "test event",
    "adultsOnly": false,
    "attendees": 100,
    "description": "test description"
  }
]
```

### Get Request

In our **`event.controllers.js`** file, let's now update the **`getEvents`** controller.

We need to update our function to make it an async function and return all the event items stored in our postgres. Update **`getEvents`** with the following code:

```javascript
const getEvents = async (ctx) => {
  try {
    const results = await Events.find();
    ctx.body = results;
    ctx.status = 200;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    throw err;
  }
};
```

Now we can make a **`GET`** request to the following endpoint: [**`http://127.0.0.1:8000/events_list`**](http://127.0.0.1:8000/events_list)

If this works correctly you should get the following:

```json
[
  {
    "_id": "RANDOM GENERATED ID",
    "attendees": 100,
    "name": "test event",
    "adultsOnly": false,
    "description": "test description",
    "__v": 0
  }
]
```

And that's all she wrote!

A mongoDB database with Koa Js, quick and painless.
