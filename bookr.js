const { Router } = require("express");
const { validationResult } = require("express-validator");
const Prisma = require("../client/prisma");
const { authMiddleware } = require("../middleware/jwt");
const { BookValidator } = require("../validator/book");
const jwt = require("jsonwebtoken");
const router = Router();

router.post("/", authMiddleware, BookValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const book = await Prisma.book.create({
    data: {
      name: req.body.name,
      authorId: req.user.id,
    },
  });
  return res.json({ data: book });
});

router.get("/", authMiddleware, async (req, res) => {
  const header = req.headers.authorization;
  const split = header.split(" ");
  const token = split[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = payload;
  const userId = req.user.id;
  const book = await Prisma.book.findMany({ where: { authorId: userId } });
  return res.json({ data: book });
});

module.exports = router;
