module.exports = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.unauthorized({message: "You are not logged in!"});
}
