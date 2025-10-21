const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  nic: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  endDate: { type: Date, default: null },
}, { timestamps: true });

staffSchema.index({ email: 1 });
staffSchema.index({ nic: 1 });

staffSchema.virtual('fullName').get(function() { return `${this.firstName} ${this.lastName}`; });

module.exports = mongoose.model('Staff', staffSchema);
