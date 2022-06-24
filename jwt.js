const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  console.log(header, "from middle");
  const split = header.split(" ");
  if (split.length !== 2) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const token = split[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    req.user = payload;
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

module.exports = { authMiddleware };
