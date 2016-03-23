module.exports = function (req, res, next) {
  if (req.param('jsonp')) {
    req.options.jsonp = true;
  }

  next();
}
