const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const UserRoutes = require("./routes/user");
const BookRoutes = require("./routes/book");
dotenv.config();

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", UserRoutes);
app.use("/books", BookRoutes);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
