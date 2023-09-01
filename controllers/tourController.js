const fs = require('fs');
// const { Promise } = require('mongoose'); // cuases error --> "Cannot read properties of undefined (reading 'all')",
const multer = require('multer');
const sharp = require('sharp');
const TourModel = require('../models/tourModel');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

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
// upload.single('image')  // req.file
// upload.arr('images', 5)  // req.files
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  console.log(
    'req.files in resizeTourImages function in tourController.js : ',
    req.files
  );
  console.log(
    'req.body in resizeTourImages function in tourController.js : ',
    req.body
  );

  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image :

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 50 })
    .toFile(`public/img/tours/${req.body.imageCover}`); // writing it to a file in the Disk.

  console.log(
    'req.body.imageCover from resizeTourImages function  :  ',
    req.body.imageCover
  );

  // 2) Images :

  req.body.images = [];

  //  for (let i = 0; i < array.length; i++)
  await Promise.all(
    // we are using map here because --> we are waiting for 3 promesis... as soon its complete will move to the next.
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      // await sharp(req.files.imageCover[0].buffer)
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 50 })
        .toFile(`public/img/tours/${filename}`); // writing it to a file in the Disk.

      // push the current filename into the array :
      req.body.images.push(filename);
    })
  );

  console.log(
    'req.body.images from resizeTourImages function  :  ',
    req.body.images
  );

  next();
});

// const readAllTours = JSON.parse(//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)// );
// exports.checkId = (req, res, next, val) => {//   console.log(`Tour id is : ${val}`);
//   if (req.params.id * 1 > readAllTours.length) {//     return res.status(404).json({//       status: 'fail',//       message: 'Invalid ID:',//     });//   }//   next();// };
// for creating tour// exports.checkBody = (req, res, next) => {//   if (!req.body.name || !req.body.price) {//     return res.status(400).json({//       status: 'fail',//       message: 'Messing name or price',//     });//   }//   next();// };

// const options = { maxTimeMS: 20000 }; // set timeout to 20 secs.

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difiiculty';
  next();
};

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // try {
//   // // 1 ) Build the Query - Filtering :
//   // console.log('req.query = ', req.query); // the Filtering
//   // const queryObj = { ...req.query };
//   // console.log(' queryObj = ', queryObj); // the Filtering
//   // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   // excludedFields.forEach((field) => delete queryObj[field]);

//   // // 2 ) Advanced Filtering :
//   // let queryString = JSON.stringify(queryObj);
//   // queryString = queryString.replace(
//   //   /\b(gte|gt|lte|lt)\b/g,
//   //   (matchedString) => `$${matchedString}`
//   // );
//   // console.log('pasrsed queryString = ', JSON.parse(queryString));
//   // console.log('pasrsed queryString $ = ', queryString);

//   // let query = TourModel.find(JSON.parse(queryString));
//   // this.query.find(JSON.parse(queryString));

//   // // 3 ) Sorting :
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' ');
//   //   console.log('sortBy = ', sortBy);
//   //   query = query.sort(sortBy);
//   // } else {
//   //   // query = query.sort('createdAt');
//   //   query = query.sort('_id'); // pagination fix.
//   // }

//   // // 4 ) fields limiting:
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   console.log('Fileds we want to show only - fieldsLimiting = ', fields);
//   //   query = query.select(fields);
//   // } else {
//   //   query = query.select('-__v');
//   // }

//   // // 5 ) Pagination :
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 100;
//   // const skip = (page - 1) * limit;
//   // query = query.skip(skip).limit(limit);
//   // if (req.query.page) {
//   //   const numTours = await TourModel.countDocuments();
//   //   if (skip >= numTours) throw new Error('This page dosent exist !!!');
//   // }

//   // 2nd EXECUTING the Query :

//   // const getAllTheTours = await TourModel.find();
//   // const getAllTheTours = await TourModel.find({
//   //   duration: 5,
//   //   difficulty: 'easy',
//   // }); // will return all the data found inside the collection.
//   // const getAllTheTours = await TourModel.find()
//   //   .where('duration')
//   //   .equals(5)
//   //   .where('difficulty')
//   //   .equals('easy');

//   // const getAllTheTours = await TourModel.find(JSON.parse(queryString));
//   const features = new APIFeatures(TourModel.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   // const tours = await query;
//   console.log('req.query =  ', req.query);

//   const tours = await features.query;
//   // console.log('req.query : ', req.query, 'queryObj : ', queryObj);

//   res.status(200).json({
//     status: 'success',
//     // results: readAllTours.length,
//     requestedAt: req.requestTime,
//     // results: getAllTheTours.length,
//     results: tours.length,
//     data: {
//       // readAllTours,
//       // getAllTheTours,
//       tours,
//     },
//   });
//   // }
//   //  catch (err) {
//   //   console.log('Reading all the Tours Error : ', err);

//   //   res.status(500).json({
//   //     status: 'Fail',
//   //     message: err,
//   //     // message: 'reading tours error. ',
//   //   });
//   // }
// });
exports.getAllTours = factory.getAll(TourModel);

// exports.getTour = catchAsync(async (req, res, next) => {
//   // try {
//   console.log(req.params);
//   console.log(req.params.id);

//   // 1
//   // TourModel.findOne({ id_: req.params.id });
//   // 2
//   // const getThisOneTour = await TourModel.findById(req.params.id); // The id in the search part.
//   // const getThisOneTour = await TourModel.findById(req.params.id).populate({
//   //   path: 'guides',
//   //   select: '-__v -passwordChangedAt', // Getting rid of the unwanted data.
//   // });
//   const getThisOneTour = await TourModel.findById(req.params.id).populate(
//     'reviews'
//   );

//   if (!getThisOneTour) {
//     return next(new AppError('Heeeey No tour found with that ID', 404));
//   }
//   // const id = req.params.id * 1;
//   // const findTourId = readAllTours.find((el) => el.id === id);

//   //   if (id > readAllTours.length) {

//   res.status(200).json({
//     status: 'success',
//     data: {
//       // findTourId,
//       getThisOneTour,
//     },
//   });
//   // } catch (err) {
//   // res.status(500).json({
//   //   status: 'Fail',
//   //   // message: err,
//   //   message: 'reading tour error. ',
//   // });
//   // }
// });
exports.getTour = factory.getOne(TourModel, { path: 'reviews' });

// Catching Errors in Async Functions :

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => next(err));
//   };
// };

// exports.createTour = catchAsync(async (req, res, next) => {
//   console.log('The req.body is ', req.body);

//   const newTour = await TourModel.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       // readAllTours: newTour,
//       newTour,
//     },
//   });

//   // try {
//   // console.log('The req.body is ', req.body);
//   // 1
//   // const newTour = new TourModel({});
//   // newTour.save();
//   // 2
//   // const newTour = await TourModel.create(req.body);
//   // const newId = readAllTours[readAllTours.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newId }, req.body);
//   // readAllTours.push(newTour);
//   // fs.writeFile(
//   //   `${__dirname}/../dev-data/data/tours-simple.json`,
//   //   JSON.stringify(readAllTours),
//   //   (err) => {
//   // res.status(201).json({
//   //   status: 'success',
//   //   data: {
//   //     // readAllTours: newTour,
//   //     newTour,
//   //   },
//   // });
//   //   }
//   // );
//   //   res.send('Done.');
//   // } catch (err) {
//   //   console.log('Creating new Tour Error : ', err);

//   //   res.status(400).json({
//   //     status: 'Fail',
//   //     message: err,
//   //     // message: 'Invalid data sent!',
//   //   });
//   // }
// });
exports.createTour = factory.createOne(TourModel);

// exports.updateTour = catchAsync(async (req, res, next) => {
//   // try {
//   const updatedTour = await TourModel.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!updatedTour) {
//     return next(new AppError('Heeeey No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       // readAllTours: '<updated tour here...>',
//       // updatedTour: updatedTour,
//       updatedTour,
//     },
//   });
//   // } catch (err) {
//   //   console.log('Updating Tour Error : ', err);

//   //   res.status(400).json({
//   //     status: 'Fail',
//   //     // message: err,
//   //     message: err,
//   //   });
//   // }
// });
exports.updateTour = factory.updateOne(TourModel);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   // try {
//   const deleteTour = await TourModel.findByIdAndDelete(req.params.id);
//   const deletedTour = deleteTour.name;

//   if (!deleteTour) {
//     return next(new AppError('Heeeey No tour found with that ID', 404));
//   }

//   console.log('Tour deleted successfully');
//   res.status(204).json({
//     status: 'success',
//     data: {
//       // deleteTour,
//       deletedTour,
//     },
//   });

// } catch (err) {
//   console.log('Deleting Tour Error : ', err);

//   res.status(400).json({
//     status: 'Fail',
//     // message: err,
//     message: err,
//   });
// }
// });
exports.deleteTour = factory.deleteOne(TourModel);

//  AGGREGATION
exports.getTourStats = catchAsync(async (req, res) => {
  // try {
  const stats = await TourModel.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: null,
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 }, // number of tours
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' }, // removing the EASY.
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (err) {
  //   console.log('Tour Stats Error : ', err);

  //   res.status(400).json({
  //     status: 'Fail',
  //     // message: err,
  //     message: err,
  //   });
  // }
});

//  AGGREGATION
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  // startDates
  const year = req.params.year * 1; // 2021
  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // grouping by the month.
        numToursStarts: { $sum: 1 }, // counting the dates.
        tours: { $push: '$name' }, // pushing the name of which tour.
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    { $sort: { numToursStarts: -1 } }, // starting from the highest number.
    { $limit: 12 }, // show only 12 fileds.
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // } catch (err) {
  //   console.log('getMonthlyPlan Error : ', err);

  //   res.status(400).json({
  //     status: 'Fail',
  //     // message: err,
  //     message: err,
  //   });
  // }
});

// '/tours-within/:distance/center/:latlng/unit/:unit'
// '/tours-within/233/center/34.261001,-118.575205/unit/mi'
exports.getToursWithin = catchAsync(async (req, res, next) => {
  // Destructoring :
  const { distance, latlng, unit } = req.params;
  // Destructoring :
  const [lat, lng] = latlng.split(',');

  // Deviding the distance with radius of the Earth to Mile or Kilometers :
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr & longtitude in the fromat lat, lng. ',
        400
      )
    );
  }

  // console.log(distance, lat, lng, unit);
  // 233 34.261001 -118.575205 mi

  // finding the tours with in the specified Radius :
  const tours = await TourModel.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  // Destructoring :
  const { latlng, unit } = req.params;
  // Destructoring :
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr & longtitude in the fromat lat, lng. ',
        400
      )
    );
  }

  const distances = await TourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        // distanceMultiplier: 0.001, // --> as deviding by 1000 to convert distance from Meters to Kilometer
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

// const fs = require('fs');

// const readAllTours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);

//   if (req.params.id * 1 > readAllTours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID:',
//     });
//   }
//   next();
// };

// // for creating tour
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Messing name or price',
//     });
//   }
//   next();
// };

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     results: readAllTours.length,
//     requestedAt: req.requestTime,
//     data: {
//       readAllTours,
//     },
//   });
// };

// exports.getTour = (req, res) => {
//   console.log(req.params);

//   const id = req.params.id * 1;
//   const findTourId = readAllTours.find((el) => el.id === id);

//   //   if (id > readAllTours.length) {

//   res.status(200).json({
//     status: 'success',
//     data: {
//       findTourId,
//     },
//   });
// };

// exports.createTour = (req, res) => {
//   console.log('The req.body is ', req.body);

//   const newId = readAllTours[readAllTours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   readAllTours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(readAllTours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           readAllTours: newTour,
//         },
//       });
//     }
//   );
//   //   res.send('Done.');
// };

// exports.updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       readAllTours: '<updated tour here...>',
//     },
//   });
// };

// exports.deleteTour = (req, res) => {
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
