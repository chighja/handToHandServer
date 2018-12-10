module.exports = {
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'mongodb://useradmin:Password1@ds155268.mlab.com:55268/hand-to-hand',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    'mongodb://useradmin:Password1@ds155268.mlab.com:55268/hand-to-hand',
  PORT: process.env.PORT || 'http://localhost:3000'
};
