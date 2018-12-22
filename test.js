const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const { Vote } = require('./voteModel');
const { app } = require('./server');

chai.use(chaiHttp);

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
    image1: faker.lorem.sentence(),
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
  beforeEach(async () => {
    await seedMatchData();
  });
  afterEach(async () => {
    await tearDownDb();
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

    it('should get match objects with correct fields', async () => {
      try {
        let resVote;
        const res = await chai.request(app).get('/votes');
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.lengthOf.at.least(1);
        res.body.forEach(function(vote) {
          expect(vote).to.be.a('object');
          expect(vote).to.include.keys(
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
        const vote = await Vote.findById(resVote._id);
        expect(resVote.nameChar1).to.equal(vote.nameChar1);
        expect(resVote.voteChar1).to.equal(vote.voteChar1);
        expect(resVote.image1).to.equal(vote.image1);
        expect(resVote.nameChar2).to.equal(vote.nameChar2);
        expect(resVote.voteChar2).to.equal(vote.voteChar2);
        expect(resVote.image2).to.equal(vote.image2);
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
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
