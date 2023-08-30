const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

/////////////////////////////////
////////////////////////////////
// router.use(authController.isLoggedIn); // Anything after this will be  :::::::::
////////////////////////////////
////////////////////////////////

router.get('/', authController.isLoggedIn, viewsController.getOverview);
// router.get('/tour/:slug', authController.protect, viewsController.getTour);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount); // for accound.pug  & /me link added inside the _header.pug

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
