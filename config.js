module.exports = {
  CLIENT_ORIGIN:
    process.env.CLIENT_ORIGIN || 'https://handtohandapp.herokuapp.com',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'mongodb://useradmin:Password1@ds155268.mlab.com:55268/hand-to-hand',
  PORT: process.env.PORT || 4000
};
