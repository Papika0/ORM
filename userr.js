const { Router } = require("express");
const { SignUpValidator, SignInValidator } = require("../validator/user");
const { validationResult, body } = require("express-validator");
const Prisma = require("../client/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = Router();

router.post("/signup", SignUpValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const { username, name } = req.body;
  const user = await Prisma.user.create({ data: req.body });
  return res.json({ status: { username, name } });
});

router.post("/signin", SignInValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const { username, password } = req.body;
  const user = await Prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(400).json({ error: "Invalid requested data" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ error: "Invalid requested data" });
  }
  const token = jwt.sign(
    {
      username,
      id: user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: `1h` }
  );

  return res.json({ token });
});

module.exports = router;
