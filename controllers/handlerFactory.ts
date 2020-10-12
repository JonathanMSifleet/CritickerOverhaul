import { catchAsyncErrors } from './../utils/catchAsyncErrors';

exports.createOne = (Model: any) =>
  catchAsyncErrors(async (req: any, res: any, next: any) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
        data: doc
    });
  });
