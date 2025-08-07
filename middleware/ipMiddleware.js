// middleware/ipMiddleware.js

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.connection.remoteAddress;
};

const ipMiddleware = (req, res, next) => {
  req.clientIp = getClientIp(req);
  next();
};

module.exports = ipMiddleware;
