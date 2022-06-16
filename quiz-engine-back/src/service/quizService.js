const {
  validateQuizCreate,
  validateQuizAnswerRequest,
} = require("../util/validate");
const connect = require("../model/models");
const createError = require("http-errors");

const quizService = {};

quizService.postQuiz = async (data, userId) => {
  const validationResponse = validateQuizCreate(data);
  if (validationResponse.error) {
    throw createError(400, validationResponse.error.message);
  }
  let quizId = generateString(6);
  let res = await connect.quizSchema.find({ quizId }, { _id: 1 });
  while (res.length) {
    quizId = generateString(6);
    res = await connect.quizSchema.find({ quizId }, { _id: 1 });
  }
  const finalData = { ...data, quizId, publishedBy: userId };
  const result = connect.quizSchema.create(finalData);
  return !!result;
};

quizService.validateQuiz = async (data) => {
  const validationResponse = validateQuizAnswerRequest(data);
  if (validationResponse.error) {
    throw createError(400, validationResponse.error.message);
  }
  const result = await connect.quizSchema.aggregate([
    {
      $match: {
        quizId: data.quizId,
      },
    },
    {
      $project: {
        questions: {
          $map: {
            input: "$questions",
            in: {
              $mergeObjects: [
                "$$this",
                {
                  options: {
                    $filter: {
                      input: "$$this.options",
                      cond: {
                        $eq: ["$$this.correct", true],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  ]);
  if (!result) {
    throw createError(404, "Quiz Id invalid");
  }
  return makeValidation(data, result[0]);
};

quizService.deleteQuiz = async (quizId, userId) => {
  const result = await connect.quizSchema.deleteOne({
    quizId,
    publishedBy: userId,
  });
  if (result.deletedCount) {
    return result.acknowledged;
  }
  throw createError(400, "Quiz Id not found");
};

quizService.listQuiz = async (userId) => {
  return connect.quizSchema.aggregate([
    {
      $match: {
        publishedBy: userId,
      },
    },
    {
      $project: {
        quizId: "$quizId",
        questions: {
          $size: "$questions",
        },
        title: "$title",
      },
    },
  ]);
};

quizService.getQuiz = async (id) => {
  const result = await connect.quizSchema.findOne(
    { quizId: id },
    { "questions.options.correct": 0, publishedBy: 0 }
  );
  if (!result) {
    throw createError(404, "Invalid Quiz ID");
  }
  return result;
};

function generateString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeValidation(userAnswer, actualAnswer) {
  const total = actualAnswer.questions.length;
  let correct = 0;
  actualAnswer.questions.map((question) => {
    const result = userAnswer.questions.find((i) => i._id === question._id);
    if (result) {
      questionValid(result, question) && correct++;
    }
  });
  return { total, correct };
}

function questionValid(user, actual) {
  if (actual.multi) {
    if (user.answer.length === actual.options.length) {
      return actual.options.every((ans) => user.answer.indexOf(ans._id) !== -1);
    }
    return false;
  }
  if (user.answer.length > 1) {
    throw createError(
      "Passed multiple answer on single correct answer question"
    );
  }
  return user.answer[0] === actual.options[0]._id;
}

module.exports = quizService;
