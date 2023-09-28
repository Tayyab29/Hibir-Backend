const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  // const token = req.body.token || req.query.token || req.headers["x-access-token"];
  const token = req.headers.authorization;
  console.log({ auth: token });

  if (!token) {
    return res.status(403).send("Unauthorized: Token missing");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = { verifyToken };
