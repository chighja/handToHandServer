module.exports = {
  CLIENT_ORIGIN:
    process.env.CLIENT_ORIGIN || 'https://warm-inlet-87726.herokuapp.com',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'mongodb://useradmin:Password1@ds155268.mlab.com:55268/hand-to-hand',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    'mongodb://useradmin:Password1@ds155288.mlab.com:55288/hand-to-hand-test',
  PORT: process.env.PORT || 4000
};
