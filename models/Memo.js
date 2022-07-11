const mongoose = require('mongoose');
const MemoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Untitled Memo',
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    tags: {
      type: String,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isProtected: {
      type: Boolean,
      default: false,
    },
    protectKey: {
      type: String,
      maxlength: 50,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Memo', MemoSchema);
