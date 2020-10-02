const catchAsyncErrors = require('./../utils/catchAsyncErrors');

exports.createOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
