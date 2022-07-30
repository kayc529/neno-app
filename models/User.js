const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { securityQuestions } = require('../utils');
const moment = require('moment');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide username'],
      minLength: 6,
      maxLength: 20,
    },
    email: {
      type: String,
      require: [true, 'Please provide email'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
    },
    password: {
      type: String,
      require: [true, 'Please provide password'],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedOn: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    birthday: {
      type: Date,
    },
    securityQuestion: {
      type: String,
      enum: securityQuestions,
    },
    securityAnswer: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  //hash password before saving in db
  //prevent overwriting the password when saving other changes
  if (!this.isModified('password') && !this.isModified('securityAnswer')) {
    return;
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified('securityAnswer')) {
    const salt = await bcrypt.genSalt(10);
    this.securityAnswer = await bcrypt.hash(
      this.securityAnswer.toLowerCase(),
      salt
    );
  }
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

UserSchema.methods.compareBirthdays = function (enteredBirthday) {
  const moment1 = moment(this.birthday);
  const moment2 = moment(enteredBirthday);
  return moment1.isSame(moment2);
};

UserSchema.methods.compareSecurityAnswers = async function (enteredAnswer) {
  const isMatch = await bcrypt.compare(
    enteredAnswer.toLowerCase(),
    this.securityAnswer
  );
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
