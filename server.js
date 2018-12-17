const express = require('express');
const mongoose = require('mongoose');
const { CLIENT_ORIGIN } = require('./config');
const { Vote } = require('./voteModel');

const app = express();

// allow requests from the client's origin
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', CLIENT_ORIGIN);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
    'AccessControlAllowMethods: GET, PATCH'
  );
  next();
});

app.use(express.json());
app.use(express.static('public'));

// connecting to mongoDb
mongoose.connect(
  'mongodb://useradmin:Password1@ds155268.mlab.com:55268/hand-to-hand',
  { useNewUrlParser: true }
);
const db = mongoose.connection;

db.once('open', function() {
  console.log('Connected to database');
}).on('error', function(error) {
  console.log('Connection error:', error);
});

// GET all match-up objects
app.get('/votes', (req, res) => {
  return Vote.find()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});

// GET match-up objects by id
app.get('/votes/:id', (req, res) => {
  return Vote.findById(req.params.id)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});

// PATCH update vote number
app.patch('/votes/:id', (req, res) => {
  let updateableFields = ['voteChar1', 'voteChar2'];

  Vote.findById(req.params.id, (error, vote) => {
    updateableFields.forEach(field => {
      if (field in req.body) {
        vote[field] = req.body[field];
      }
    });
    vote.save();
    res.status(200).json({ vote });
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: 'something went wrong' });
  });
});

app.listen(process.env.PORT || 5005);

module.exports = { app };
