export const createErrorResponse = (res, code, message) => {
  res.status(code).json({
    error: message
  });
};
