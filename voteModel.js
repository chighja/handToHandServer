const mongoose = require('mongoose');

const voteSchema = mongoose.Schema(
  {
    nameChar1: { type: String },
    voteChar1: { type: Number },
    image1: { type: String },
    nameChar2: { type: String },
    voteChar2: { type: Number },
    image2: { type: String }
  },
  { collection: 'votes' }
);

const Vote = mongoose.model('voteSchema', voteSchema);
module.exports = { Vote };
