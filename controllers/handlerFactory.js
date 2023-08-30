const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    const deletedDoc = doc.name;
    console.log('The Deleted Document is :   ', deletedDoc);

    if (!doc) {
      return next(new AppError('No document tour found with that ID', 404));
    }

    console.log('Tour deleted successfully');
    res.status(204).json({
      status: 'success',
      data: {
        deletedDoc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updateDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateDoc) {
      return next(new AppError('Heeeey No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updateDoc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('The req.body is ', req.body);

    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params);
    console.log(req.params.id);

    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    // const getThisOneDoc = await Model.findById(req.params.id).populate(
    //   'reviews'
    // );
    const getThisOneDoc = await query;

    if (!getThisOneDoc) {
      return next(new AppError('Heeeey No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: getThisOneDoc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To Allow for nest GET reviews on tour (hack):
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    console.log('req.query =  ', req.query);

    // const getAllDocs = await features.query.explain(); // explain() for indexes :
    const getAllDocs = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: getAllDocs.length,
      data: {
        data: getAllDocs,
      },
    });
  });
