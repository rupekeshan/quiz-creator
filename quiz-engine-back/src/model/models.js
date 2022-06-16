const mongoose = require("mongoose");
const { v4 } = require("uuid");
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { strict: true, timestamps: true, collection: "users" }
);

const generateSeq = new mongoose.Schema(
  {
    _id: String,
    seq: Number,
  },
  { collection: "seq_gen" }
);

const tokenSchema = new mongoose.Schema(
  {
    token: String,
  },
  { collection: "tokens" }
);

const questionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: v4
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      _id: {
        type: String,
        required: true,
        default: v4
      },
      text: {
        type: String,
        required: true,
      },
      correct: {
        type: Boolean,
        required: false,
      },
    },
  ],
  multi: {
    type: Boolean,
    required: true,
  }
});

const quizSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSchema],
    },
    publishedBy: {
      type: String,
      required: true,
    },
  },
  { collection: "quiz"}
);


const collection = {};

collection.generateSchema = mongoose.model("seq_gen", generateSeq);
collection.userSchema = mongoose.model("user", userSchema);
collection.tokenSchema = mongoose.model("tokens", tokenSchema);
collection.quizSchema = mongoose.model("quiz", quizSchema);

module.exports = collection;
