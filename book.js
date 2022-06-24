const { checkSchema } = require("express-validator");
const BookValidator = checkSchema({
  name: {
    isEmpty: false,
    isString: true,
  },
});
module.exports = { BookValidator };
