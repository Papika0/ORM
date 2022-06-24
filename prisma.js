const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const Prisma = new PrismaClient();

Prisma.$use(async (params, next) => {
  if (params.action === "create" && params.model === "User") {
    const user = params.args.data;
    const password = bcrypt.hashSync(user.password, 10);
    user.password = password;
    params.args.data = user;
  }

  return next(params);
});
module.exports = Prisma;
