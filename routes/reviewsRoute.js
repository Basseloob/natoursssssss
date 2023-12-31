const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// const router = express.Router();
const router = express.Router({ mergeParams: true });

// POST /tour/1232gh1/reviews
// POST /reviews

/////////////////////////////////
////////////////////////////////
router.use(authController.protect); // Anything after this will be protected :::::::::
////////////////////////////////
////////////////////////////////

router.route('/').get(reviewController.getAllReviews).post(
  // authController.protect,
  authController.restrictTo('user'),
  reviewController.setTourUserIds,
  reviewController.createReview
);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview
  );

module.exports = router;
