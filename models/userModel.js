const crypto = require('crypto'); // is a bultin node module.
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// // 2: Creating Schema.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour name is required'],
    // unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    // To use our custome validator :
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: { type: String, default: 'default.jpg' },
  // Roles fo accessing a protected route :
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'Please confirm your password'],
    // To use our cutome validator :
    // No arrow function because we want to use (this.) keyword.
    validate: function (el) {
      // This only works on CREATE & SAVE!!!
      return el === this.password; // passwordConfirm === password.
    },
    message: 'Passwords are not the same!',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date, // as a security measure : the passwordResetToken will expires after cetrtain amount of time.
  // For knowing the user ahs deleted or not :
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

////////////////////////////////
/// password Encrytpion :
////////////////////////////////

// The encryption is between getting the data and saving it into the DB :
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified :
  if (!this.isModified('password')) return next();

  // Encrypting the password with cost of 12 :
  this.password = await bcrypt.hash(this.password, 12);
  // Seleting the passwordConfirm field  // we are removing it here becasue its required as an input but then we remove it here :
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  // If we didnt modify the password just dont do anything:
  if (!this.isModified('password') || this.isNew) return next();

  // 1 second in the past will always insure insure that the token is always created after
  // the pasword has been changed :
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // This points to the current query - only show the active users :
  this.find({ active: { $ne: false } });
  next();
});

// input password VS DB saved password :
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password --> will not work becasue of password = false inside the scehma :
  // compare() function will return true if the 2 argument are the same ;
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimesstamp) {
  if (this.passwordChangedAt) {
    const changedTimesstamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // converting the time from this( JWTTimesstamp :  1685966379 )  to this ()

    console.log(
      'this.passwordChangedAt : ',
      // this.passwordChangedAt,
      changedTimesstamp,
      '   &&  JWTTimesstamp : ',
      JWTTimesstamp
    );

    return JWTTimesstamp < changedTimesstamp; // 100 < 200
  }

  return false; // Means :  the user didnt change the password after the token was initiated.
};

userSchema.methods.createPasswordResetToken = function () {
  // 1) Creating the reset token :
  const resetToken = crypto.randomBytes(32).toString('hex'); // This token wich will be sent to the user, which the user can then use to reset the password .

  // 2) encrypting the resetToken to be save into the DB:
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(
    'resetToken : ',
    { resetToken },
    'this.passwordResetToken the encrypted one: ',
    this.passwordResetToken
  );

  // Expiration date for the resetToken :
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Sending by email .
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('Error saving the doc into the database : ', err);
//   });
