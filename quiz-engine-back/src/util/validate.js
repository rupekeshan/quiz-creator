const Joi = require("joi");

const validation = {};

validation.validateSignupSignin = (data) => {
  const signupObj = Joi.object({
    email: Joi.string().max(50).required().email().strict(),
    password: Joi.string().max(20).required().strict(),
  });
  return signupObj.validate(data);
};

validation.validateToken = (data) => {
  const tokenObj = Joi.object({
    token: Joi.string().required().strict(),
  });
  return tokenObj.validate(data);
};

validation.validateQuizCreate = (data) => {
  const questionObj = Joi.object({
    question: Joi.string().required().max(500).strict(),
    options: Joi.array()
      .required()
      .min(1)
      .max(5)
      .items(
        Joi.object({
          text: Joi.string().required().max(200).strict(),
          correct: Joi.boolean().required().strict(),
        })
      ),
    multi: Joi.boolean().required().strict(),
  });
  const quizObj = Joi.object({
    title: Joi.string().required().max(50).strict(),
    questions: Joi.array().required().max(10).items(questionObj),
  });

  return quizObj.validate(data);
};

validation.validateQuizAnswerRequest = (data) => {
  const quizObj = Joi.object({
    quizId: Joi.string().required().strict(),
    questions: Joi.array()
      .required()
      .max(10)
      .items(
        Joi.object({
          _id: Joi.string().required().strict(),
          answer: Joi.array().required()
            .items(Joi.string().strict()),
        })
      ),
  });
  return quizObj.validate(data)
};

module.exports = validation;
