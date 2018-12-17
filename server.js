const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');
const { Vote } = require('./voteModel');

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    optionsSuccessStatus: 200
  })
);

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

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

// GET votes by id
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
