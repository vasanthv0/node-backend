module.exports = (requiredRole, requiredHotelId = null) => {
  return (req, res, next) => {
    const user = req.decoded;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    if (requiredHotelId && user.hotelId !== requiredHotelId) {
      return res.status(403).json({ message: "Forbidden: wrong branch" });
    }

    next();
  };
};
