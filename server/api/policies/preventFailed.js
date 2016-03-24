module.exports = function (req, res, next) {
  if (!req.user)
    return res.unauthorized();

  if (req.user.failures >= req.user.maxFailures) {
    return res.badRequest({message: "You've hit the limit for using the API with bad data. Please contact an administrator with this message."});
  }

  next();
}
