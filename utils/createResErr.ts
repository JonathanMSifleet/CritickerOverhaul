module.exports = function(res, code, message) {
  res.status(code).json({
    error: message
  });
}
