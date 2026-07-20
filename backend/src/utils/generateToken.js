const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
};

exports.generateToken = generateToken;