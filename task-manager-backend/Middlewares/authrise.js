const authrised = (permittedRoles) => {
  return (req, res, next) => {
    const userRole = req.body.user.role;

    if (permittedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(401).json({ message: "Not authorised for this route" });
    }
  };
};

module.exports = {
  authrised,
};
