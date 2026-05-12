import { ApiError } from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, err?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  };

  return res.status(error.statusCode).json(response);
};

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export { errorHandler, notFound };
