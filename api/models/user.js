const { Schema, model } = require('mongoose');
//const utils = require('../utils');
const bcryptjs = require('bcryptjs');

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  emailVerified: { type: Boolean, default: false },
  password: { type: String, select: false }
});

userSchema.pre('save', function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Hash the password using our new salt
  bcryptjs.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);

    // Override the cleartext password with the hashed one
    this.password = hash;
    next();
  });
});

userSchema.statics.idExists = async _id => {
  const user = await model('User').findOne({ _id });

  return !!user;
};

userSchema.statics.emailExists = async email => {
  const user = await model('User').findOne({ email });

  return !!user;
};

userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcryptjs.compare(password, this.password);

  return compare;
};

module.exports = model('User', userSchema);
