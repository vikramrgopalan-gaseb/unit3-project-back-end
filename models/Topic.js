const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  originator: { type: String, required: true },
  
  upvotes: {type: Array},
  
  downvotes: {type: Array}

});

module.exports = mongoose.model('Topic', TopicSchema);