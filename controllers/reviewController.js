const ReviewModel = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   // Cheking if there is tour id :
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await ReviewModel.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });
exports.getAllReviews = factory.getAll(ReviewModel);

// will set the id added in the reviewRoutes : before the create review :
exports.setTourUserIds = (req, res, next) => {
  // Allow Nested Routes :
  if (!req.body.tour) req.body.tour = req.params.tourId; // review must belong to a tour.
  if (!req.body.user) req.body.user = req.user.id; // review must belong to a user.

  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   // // Allow Nested Routes :
//   // if (!req.body.tour) req.body.tour = req.params.tourId; // review must belong to a tour.
//   // if (!req.body.user) req.body.user = req.user.id; // review must belong to a user.

//   console.log('req.params.tourId = ', req.params.tourId);
//   console.log('req.user.id = ', req.user.id);

//   const newReview = await ReviewModel.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });
exports.createReview = factory.createOne(ReviewModel);

exports.getReview = factory.getOne(ReviewModel);
exports.updateReview = factory.updateOne(ReviewModel);
exports.deleteReview = factory.deleteOne(ReviewModel);
