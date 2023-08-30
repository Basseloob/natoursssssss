const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// the photo is not saved in the DB its just contains the photo link from the File System.

const router = express.Router();

// create new user :
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logOut); // we are only getting the cookie = get
// updating the paswords :
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

////////////////////////////////
router.use(authController.protect); // Anything after this will be protected :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
////////////////////////////////

router.patch(
  '/updateMyPassword',
  // use protect --> only for loggedin users :
  // authController.protect,
  authController.updatePassword
);

router.get(
  '/me',
  // authController.protect,
  userController.getMe, // getMe middleware :
  userController.getUser // faking that the id is comming the controller.
);
router.patch(
  '/updateMe',
  // authController.protect,
  // upload.single('photo'),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete(
  '/deleteMe',
  // authController.protect,
  userController.deleteMe
); // We are not actually deleting the user from the DB.

/////////////////////////////////
////////////////////////////////
router.use(authController.restrictTo('admin')); // Anything after this will be protected bu ony Admins :
////////////////////////////////
////////////////////////////////

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
