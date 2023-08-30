const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const userModel = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// storing the file as its in the FS :
// const multerStorage = multer.diskStorage({
//   destination: (req, file, callbackFn) => {
//     callbackFn(null, 'public/img/users');
//   },
//   filename: (req, file, callbackFn) => {
//     // user-idnum-2727272727.jpeg  --> to prevent if the same user upload more than one photo no to have the same name :
//     // 1) Extract the file name from the uploaded file :
//     const extension = file.mimetype.split('/')[1]; //  mimetype: 'image/jpeg', --> coming from console.log('userController.js updateMe fn : ', req.file);  console.log('userController.js updateMe fn : ', req.body);
//     callbackFn(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });
const multerStorage = multer.memoryStorage(); // this way the image will be stored as a Buffer.
// Multer Filter :
const multerFilter = (req, file, callbackFn) => {
  if (file.mimetype.startsWith('image')) {
    callbackFn(null, true);
  } else {
    callbackFn(
      new AppError('not an image ! please upload only images', 404),
      false
    );
  }
};
// uploading
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const upload = multer({ dest: 'public/img/users' });
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // when doing image processing its better to save inot memory not into disk :
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`); // writing it to a file in the Disk.

  next();
});

const filterObj = (obj, ...allowedFields) => {
  // 1) loop through the fileds that is in the Obj :
  // 2) And then for each field we check if is one of the allowed fields :
  // 3) If its we create a new field ...allowedFields :

  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const readAllUsers = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

// exports.getAllUsers = catchAsync(async (req, res) => {
//   const users = await userModel.find();
//   // console.log('req.query : ', req.query, 'queryObj : ', queryObj);

//   res.status(200).json({
//     status: 'success',

//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });
exports.getAllUsers = factory.getAll(userModel);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id; // will be getting it from --> authController.protect the logged in user.
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log('userController.js updateMe fn : ', req.file);
  console.log('userController.js updateMe fn : ', req.body);

  // 1) Create error if user POSTs password data :
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates, Please use / updateMyPassword.',
        400
      )
    );

  // 2) Filtered out unwanted fieldsNAMES that are not allowed to be updated :
  // Only allow to update the 'name' and 'email' - we don't want to the access to ( body.role: 'admin ) :
  const filteredBody = filterObj(req.body, 'name', 'email');

  // adding the photo if req has file:
  if (req.file) filteredBody.photo = req.file.filename; // filename coming from --> coming from console.log('userController.js updateMe fn : ', req.file);  console.log('userController.js updateMe fn : ', req.body);

  // 3) Update user document :
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true, // mongoose will validate our inputs.
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });

  console.log('User has been deleted. ');
  res.status(204).json({
    status: 'success',
    data: {},
  });
});

// exports.getUser = (req, res) => {
//   console.log(req.params);

//   const id = req.params.id * 1;
//   const findUserId = readAllUsers.find((el) => el.id === id);

//   //   if (id > readAllUsers.length) {
//   //   if (!findUserId) {
//   //     return res.status(404).json({
//   //       status: 'fail',
//   //       message: 'Invalid ID:',
//   //     });
//   //   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       findUserId,
//     },
//   });
// };
exports.getUser = factory.getOne(userModel);

// exports.getUserByName = (req, res) { }

exports.createUser = (req, res) => {
  console.log(req.body);

  // const newId = readAllUsers[readAllUsers.length - 1].id + 1;
  // const newUser = Object.assign({ id: newId }, req.body);
  // readAllUsers.push(newUser);

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/users.json`,
  //   JSON.stringify(readAllUsers),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         readAllUsers: newUser,
  //       },
  //     });
  //   }
  // );
  // //   res.send('Done.');
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use / Signup insted.',
  });
};

// exports.updateUser = (req, res) => {
//   //   if (req.params.id * 1 > readAllUsers.length) {
//   //     return res.status(404).json({
//   //       status: 'fail',
//   //       message: 'Invalid ID:',
//   //     });
//   //   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       readAllUsers: '<updated tour here...>',
//     },
//   });
// };
// Do Not update passwords with this!
exports.updateUser = factory.updateOne(userModel);

// exports.deleteUser = (req, res) => {
//   if (req.params.id * 1 > readAllUsers.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID:',
//     });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
exports.deleteUser = factory.deleteOne(userModel);
