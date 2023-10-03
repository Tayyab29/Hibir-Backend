const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  // const token = req.body.token || req.query.token || req.headers["x-access-token"];
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send("Unauthorized: Token missing");
  }
  // Remove "Bearer " using a regular expression
  const cleanedToken = token.replace(/^Bearer\s/, "");

  try {
    const decoded = jwt.verify(cleanedToken, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
  return next();
};

module.exports = { verifyToken };
