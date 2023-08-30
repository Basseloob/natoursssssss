const mongoose = require('mongoose');
const TourModel = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // Parent refrencing :
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour', // or "tourModel" ?
      required: [true, 'Review must belong to a tour.'],
    },
    // Parent refrencing :
    user: {
      // Who wrote the review.
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    // When something calls JSON.stringify() on a Mongoose object, it will internally call the toJSON method we define on the schema. The toObject() method is for converting a Mongoose object to a regular JavaScript object. For example, when you console.log a Mongoose object it calls the toObject method internally.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.index({ tour: 1, user: 1 }, { unique: true, dropDups: true });

// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre('save', async function (next) {
  const existingReview = await this.constructor.findOne({
    tour: this.tour,
    user: this.user,
  });

  if (existingReview) {
    // If a review already exists for the same tour and user combination, prevent saving the new review
    const error = new Error('Duplicate review');
    error.statusCode = 400;
    return next(error);
  }

  next();
});

// populate : When we query for the reviews we get this information :
reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     // this. always points to the current query.
  //     path: 'tour',
  //     select: 'name', // Only send the relevant data --> which is here the "name".
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 }, // add one for each tour that matched.
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log('------------------------------------------------------------');
  console.log('The statistics is =  ', stats);

  if (stats.length > 0) {
    // save this statistics in the current tour :
    await TourModel.findByIdAndUpdate(tourId, {
      // ratingsQunatity: 1,
      // ratingsAvergae: 1,
      ratingQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await TourModel.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingsAverage: 4.5, // return it to the default values.
    });
  }
};

// Calling the function :
reviewSchema.post('save', function () {
  // this --> points to the current reviewmodel :
  console.log('------------------------------------------------------------');
  console.log('reviewSchema.post save');

  this.constructor.calcAverageRatings(this.tour); // contructor so we can call the function calcAvg down :
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Summary: We were getting the error that query has been executed already which is not being restrictred feature in mongoose that once you query something why would you again want to query that again.
  // So, to get rid of this restriction we've to clone the query and execute it. once it's completed then we'll execute the same query from our facotryUpdateOne function/controller.
  this.review = await this.findOne().clone(); // this. is the current query :
  // this.reviw = await this.findOne();
  // console.log(this.review);

  console.log('------------------------------------------------------------');
  console.log('this.review = await this.findOne().clone();');

  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // this.review = await this.findOne().clone(); does not work here because its already excuted :
  await this.reviw.constructor.calcAverageRatings(this.reviw.tour);

  console.log('------------------------------------------------------------');
  console.log(
    'await this.reviw.constructor.calcAverageRatings(this.reviw.tour);'
  );
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
