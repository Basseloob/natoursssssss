const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();
const authController = require('../controllers/authController');
// const reviewsController = require('../controllers/reviewController');
const reviewRouter = require('./reviewsRoute');

// Every time we call tours/:id ist gonna log that id in console.//
// router.param('id', tourController.checkId);

// // Nested routes :
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewsController.createReview
//   );
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

// Geospatial Queries :
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// if USER not authenticated it will not get the getALlTours :
router.route('/').get(tourController.getAllTours).post(
  // tourController.checkBody,
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.createTour
);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    // Only allowed users that can delete.
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const express = require('express');// const tourController = require('../controllers/tourController');
// const router = express.Router();
// // Every time we call tours/:id ist gonna log that id in console.// router.param('id', tourController.checkId);
// router//   .route('/')//   .get(tourController.getAllTours)//   .post(tourController.checkBody, tourController.createTour);// router//   .route('/:id')//   .get(tourController.getTour)//   .patch(tourController.updateTour)//   .delete(tourController.deleteTour);
// module.exports = router;
