module.exports = function (req, res, next) {
  if (!AuthService.hasPermission(req.user, 'player')) {
    return res.forbidden({message: "You do not have permission to access this page."});
  }

  next();
};
