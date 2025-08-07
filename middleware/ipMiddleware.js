// backend/middleware/ipMiddleware.js

module.exports = function getClientIP(req, res, next) {
  const forwarded = req.headers['x-forwarded-for'];
  req.clientIP = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
  next();
};
