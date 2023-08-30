const tourModel = require('../models/tourModel');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get the tour data from the collection :
  const tours = await tourModel.find();

  // 2) Build Template :

  // 3) Render that Template using tour data from 1) :

  res.status(200).render('overview.pug', {
    title: 'All Tours',
    tours,
    // user: 'Basil Baragaba',
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour ( including reviews & guides ) :
  const tour = await tourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  // 2) Build template :

  // 3) Render template using the data from 1) :
  res.status(200).render('tour.pug', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    // login in template.
    title: 'Log into your account', // the base tempplate will read the title --> and put it in the titleHTML element :
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    // login in template.
    title: 'Your account', // the base tempplate will read the title --> and put it in the titleHTML element :
  });
};

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   console.log(
//     'UPDATING USER  : ',
//     req.body // need in the app.js file --> app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//   );
// });
exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log(
    'UPDATING USER  : ',
    req.body // need in the app.js file --> app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  );

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      // this ID is inside --> req.user.id && we need to protect this rout becasue we when prtecting we can get the id.
      name: req.body.name,
      email: req.body.email, // email and name --> we gave it this names from the html from in the account.pug file.
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // rendering the page after updating the data :
  res.status(200).render('account', {
    // login in template.
    title: 'Your account', // the base tempplate will read the title --> and put it in the titleHTML element :
    user: updatedUser,
  });
});
