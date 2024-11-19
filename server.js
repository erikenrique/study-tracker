// set up ======================================================================
// get all the tools we need

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
require('dotenv').config();

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'study_tracker';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);
        
        // Start the server only after DB connection is successful
        app.listen(process.env.PORT || 3000, () => {
          console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(error => console.error("Failed to connect to the database:", error));

app.use(fileUpload());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  if (!db) {
      return res.status(500).send("Database connection not established");
  }
  db.collection('topics').find().sort({ upvotes: -1 }).toArray((err, result) => {
      if (err) return console.log(err);
      res.render('index.ejs', { topics: result });
  });
});

app.post('/topics', (req, res) => {

  const bodyData = Object.assign({}, req.body);
  console.log('Form data:', bodyData);
  console.log('File data:', req.files);


  // convert image to binary data for mongoDB upload
  const imageBuffer = req.files && req.files.image ? req.files.image.data : null;

  db.collection('topics').insertOne({
    topic: bodyData.topic,
    description: bodyData.description,
    level: bodyData.level,
    upvotes: 0,
    image: imageBuffer // save the image data in mongodb
  }, (err, result) => {
    if (err) return console.log(err, req);
    console.log('Topic saved to database');
    res.redirect('/');
  });
});



app.put('/addUpvote', (req, res) => {
  db.collection('topics').findOneAndUpdate(
    { topic: req.body.topic, description: req.body.description },
    { $set: { upvotes: req.body.upvotes + 1 } },
    { sort: { _id: -1 }, upsert: true },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});

app.put('/addDownvote', (req, res) => {
  db.collection('topics')
  .findOneAndUpdate({topic: req.body.topic, description: req.body.description}, {
    $set: {
      upvotes: req.body.upvotes - 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/topics', (req, res) => {
  db.collection('topics').findOneAndDelete({topic: req.body.topic, description: req.body.description}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Topic deleted!')
  })
})

// launch ======================================================================
// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)
// })
