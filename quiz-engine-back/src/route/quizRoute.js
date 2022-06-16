const express = require("express");
const quizService = require("../service/quizService");
const authorization = require("../util/authorize");
const router = express.Router();

router.post("/add", authorization, (req, res, next) => {
  quizService
    .postQuiz(req.body, req.user.userId)
    .then((result) => {
      res.status(200).json({ message: "Quiz Created Successfully", result });
    })
    .catch((e) => {
      next(e);
    });
});

router.post("/check", (req, res, next) => {
  quizService
    .validateQuiz(req.body)
    .then((result) => {
      res.status(200).json({result})
    })
    .catch((e) => {
      next(e);
    });
});

router.delete("/delete/:id", authorization, (req, res, next) => {
  quizService
    .deleteQuiz(req.params.id, req.user.userId)
    .then((result) => {
      res.status(200).json({result})
    })
    .catch((e) => {
      next(e);
    });
});

router.get("/list", authorization, (req, res, next) => {
  quizService
    .listQuiz(req.user.userId)
    .then((result) => {
      res.status(200).json({ message: "Fetched successfully", result });
    })
    .catch((e) => {
      next(e);
    });
});

router.get("/get/:id", (req, res, next) => {
  quizService
    .getQuiz(req.params.id)
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((e) => {
      next(e);
    });
});

module.exports = router;
