const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const QuizRouter = require("./src/route/quizRoute");
const UserRouter = require("./src/route/userRoute");
const errorhandler = require("./src/util/errorHandler");
const { PORT, FRONTEND_URL, MONGO_STRING } = require("./src/util/config");

const app = express();
const port = PORT || 4000;

//middlewares
app.use(cors({origin: FRONTEND_URL}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/quiz", QuizRouter);
app.use("/api/user", UserRouter);

app.get("/test", (req, res) => {
  res.json({ check: "working perfect" });
});

app.use(errorhandler);

mongoose
  .connect(MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "quizapp",
  })
  .then(() => {
    console.log("successfully connected to DB");
  })
  .catch((e) => {
    console.log("Something went wrong on connection to db", e);
  });

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
