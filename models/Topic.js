const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

module.exports = mongoose.model('Topic', TopicSchema);