const express = require('express');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const { Vote } = require('./voteModel');
const { TEST_DATABASE_URL, PORT } = require('./config');

chai.use(chaiHttp);

// connecting to mongoDb
// mongoose.connect(
//   'mongodb://useradmin:Password1@ds155288.mlab.com:55288/hand-to-hand-test',
//   { useNewUrlParser: true }
// );
// const db = mongoose.connection;

// db.once('open', function() {
//   console.log('Connected to database');
// }).on('error', function(error) {
//   console.log('Connection error:', error);
// });

// seeds the test-database with mock data
function seedMatchData() {
  console.info('seeding match data');
  const seedData = [];
  for (let i = 1; i <= 6; i++) {
    seedData.push(generateMatchData());
  }
  return Vote.insertMany(seedData);
}

// creates match object
function generateMatchData() {
  return {
    nameChar1: faker.name.findName(),
    voteChar1: faker.random.number(),
    image: faker.lorem.sentence(),
    nameChar2: faker.name.findName(),
    voteChar2: faker.random.number(),
    image2: faker.lorem.sentence()
  };
}

// remove test-database
function tearDownDb() {
  console.warn('deleting database');
  return mongoose.connection.dropDatabase();
}

// database setup and teardown process
describe('match data resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function() {
    return seedMatchData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });

  // GET test
  describe('GET', function() {
    it('should get all existing match objects', function() {
      return chai
        .request(app)
        .get('/votes')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
        });
    });

    it('should get match objects with correct fields', function(done) {
      let resVote;
      return chai
        .request(app)
        .get('/votes')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.lengthOf.at.least(1);
          res.body.forEach(function(Vote) {
            expect(Vote).to.be.a('object');
            expect(Vote).to.include.keys(
              '_id',
              'nameChar1',
              'voteChar1',
              'image1',
              'nameChar2',
              'voteChar2',
              'image2'
            );
          });
          resVote = res.body[0];
          console.log(resVote._id);
          return Vote.findById(resVote._id);
        })
        .then(function(Vote) {
          expect(res.Vote.nameChar1).to.equal(Vote.nameChar1);
          expect(res.Vote.voteChar1).to.equal(Vote.voteChar1);
          expect(res.Vote.image1).to.equal(Vote.image1);
          expect(res.Vote.nameChar2).to.equal(Vote.nameChar2);
          expect(res.Vote.voteChar2).to.equal(Vote.voteChar2);
          expect(res.Vote.image2).to.equal(Vote.image2);
        })
        .then(done());
    });
  });

  // PATCH test
  describe('PATCH', function() {
    it('should update vote number value', function() {
      const updatedVote = {
        voteChar1: +1
      };
      return Vote.findOne()
        .then(function(vote) {
          updatedVote.id = vote.id;
          return chai
            .request(app)
            .patch(`/votes/${vote.id}`)
            .send(updatedVote);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          return Vote.findById(updatedVote.id);
        })
        .then(function(vote) {
          expect(vote.voteChar1).to.equal(updatedVote.voteChar1);
        });
    });
  });
});

let server;

function runServer(TEST_DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      TEST_DATABASE_URL,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`your app is listening on port ${port}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
