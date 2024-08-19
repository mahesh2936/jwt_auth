const mongoose = require('mongoose');
const { DocTypes } = require('../../config/constants');

const docSchema = mongoose.Schema({
  _id: false,
  docType: {
    type: String,
    enum: Object.values(DocTypes),
    default: DocTypes.CUSTOM,
  },
  docId: {
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { docId: { $type: 'string' } },
    },
    set: (v) => (v === '' ? null : v),
  },
  docUrl: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: String,
  },
});

module.exports = docSchema;
