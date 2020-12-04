const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true},
  token: { type: String },
  emailVerified: { type: Boolean, default: false },
  password: { type: String }
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

userSchema.statics.phoneExists = async phone => {
  const user = await model('User').findOne({ phone });

  return !!user;
};

userSchema.statics.getUserById = async id => {
  const user = await model('User').findOne({ _id: id });

  return user;
};

userSchema.statics.getUserByEmail = async email => {
  const user = await model('User').findOne({ email: email });

  return user;
};

module.exports = model('User', userSchema);