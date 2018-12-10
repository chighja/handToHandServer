const mongoose = require('mongoose');

const voteSchema = mongoose.Schema(
  {
    voteChar1: { type: Number },
    voteChar2: { type: Number }
  },
  { collection: 'votes' }
);

const Vote = mongoose.model('voteSchema', voteSchema);
module.exports = { Vote };
