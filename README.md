In this part, we'll be starting from where we left off in part 1 but create a NoSQL database instead. To do this we'll be using **MongoDB**.

Before we start let's make sure we have [**MongoDB**](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/) installed.

Run the following command:

```
mongod --version
```

If it's installed, let's proceed.

## Setup

MongoDB is non-relational database, meaning each object we post into our database does not need to have the same keys. But mongoose allows us to set up schemas which makes our types more strict.

In this tutorial we will be using [**Mongoose**](https://mongoosejs.com/). So let's start by installing **Mongoose**:

```
npm i mongoose
```

## Models

Once mongoose is installed let's create our **models folder** and our first model and called it **event.models.js**.

So let's run the following commands:

```
mkdir models
touch models/index.js
touch models/event.models.js
```

These commands will create a folder with two files named **index.js** and **event.models.js**.

Let's first add the following code to **index.js**:

```
const mongoose = require('mongoose');

const settings = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect("mongodb://localhost:27017/database", settings);

module.exports = mongoose;
```

This file will connect us to our mongoDB database.

## Create our first model

Now let's add the following to **event.models.js**:

```
const { Schema, model } = require('.');

const eventsSchema = new Schema({
    attendees: Number,
    name: String,
    adultsOnly: Boolean,
    description: String,
    organizers: String
});

const Events = model('Events', eventsSchema);

module.exports = Events;
```

These are the types we've just created:

1. **Name** - this will be a string representing the name of the event.
2. **Adults Only** - this will be a boolean field.
3. **Attendees** - this will be a number representing the number of attendees.
4. **Description** - this will also be a string field.

## Controllers

Let's import the model we just created into our controllers file.

```
const events = require('../models/events');
```

## Post Request

Let's now update our post request in our **event.controllers.js**

The post request takes the request body and creates an object in our mongo database.

- A successful request will return **'Event Created!'**,
- An unsuccessful request will return a status **500 error**.

```
const postEvent = async ctx => {
    try {
        await Events.create(ctx.request.body);
        ctx.body = 'Event Created!'
        ctx.status = 201;
    } catch (e) {
        console.log(err)
        ctx.status = 500
        throw(err)
    }
};
```

Try posting an item to the following endpoint on postman [**http://127.0.0.1:8000/post_event**](http://127.0.0.1:8000/post_event):

![Postman Image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gxzjtsd0img7gdmjx4vd.png)

Let's move on to the get request!

## Get Request

Let's also update our get request in our **event.controllers.js**.

We need to update our function to make it async and returns all the event items stored in our Mongo database.

```
const getEvents = async ctx => {
    try {
        const results = await Events.find()
        ctx.body = results
        ctx.status = 200
    } catch (err) {
        console.log(err)
        ctx.status = 500
        throw(err)
    }
}
```

Try posting an item to the following endpoint on postman [**http://127.0.0.1:8000/events_list**](http://127.0.0.1:8000/events_list):

If this works correctly you should get the following:

```
[
    {
        "_id": "RANDOM GENERATED ID",
        "attendees": 100,
        "name": "test event",
        "adultsOnly": false,
        "description": "test event description",
        "__v": 0
    }
]
```

And that's all she wrote! A mongoDB database with Koa Js, quick and painless.
