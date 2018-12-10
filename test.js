const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const { Vote } = require('./voteModel');

const { app } = require('./server.js');
const { TEST_DATABASE_URL, PORT } = require('./config');

chai.use(chaiHttp);

// seeds the test-database with mock data
function seedCharVoteData() {
  console.info('seeding character vote data');
  const seedData = generateCharVoteData();
  return Vote.insertMany(seedData);
}

// creates user comment objects
function generateCharVoteData() {
  return {
    nameChar1: faker.name.findName(),
    voteChar1: faker.random.number(),
    nameChar2: faker.name.findName(),
    voteChar2: faker.random.number()
  };
}

// remove test-database
function tearDownDb() {
  console.warn('deleting database');
  return mongoose.connection.dropDatabase();
}

// database 'open server, create database, remove database, close server' process
describe('char vote data resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function() {
    return seedCharVoteData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });

  // GET test
  describe('GET', function() {
    it('should get char vote by id', function() {
      return chai
        .request(app)
        .get('/votes/:id')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
        });
    });

    it('should get char votes with correct fields', function(done) {
      let resVote;
      return chai
        .request(app)
        .get('/votes')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          res.body.forEach(vote => {
            expect(vote).to.be.a('object');
            expect(vote).to.include.keys(
              '_id',
              'nameChar1',
              'voteChar1',
              'nameChar2',
              'voteChar2'
            );
          });
          resVote = res.body[0];
          console.log(resVote._id);
          return Vote.findById(resVote._id);
        })
        .then(vote => {
          expect(resVote.nameChar1).to.equal(vote.nameChar1);
          expect(resVote.voteChar1).to.equal(vote.voteChar1);
          expect(resVote.nameChar2).to.equal(vote.nameChar2);
          expect(resVote.voteChar2).to.equal(vote.voteChar2);
        })
        .then(done());
    });
  });

  describe('PATCH', function() {
    it('should update sent fields', function() {
      const updateVote = {
        charVote1: faker.random.number()
      };
      return Vote.findOne()
        .then(vote => {
          updateVote.id = vote.id;
          return chai
            .request(app)
            .put(`/votes/${vote.id}`)
            .send(updateVote);
        })
        .then(res => {
          expect(res).to.have.status(200);
          return Vote.findById(updateVote.id);
        })
        .then(vote => {
          expect(vote.voteChar1).to.equal(updateVote.voteChar1);
        });
    });
  });
});

let server;

function runServer(databaseURL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseURL,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
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
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
