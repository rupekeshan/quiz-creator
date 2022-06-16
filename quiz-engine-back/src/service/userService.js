const connect = require("../model/models");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignupSignin, validateToken } = require("../util/validate");
const {
  REFRESH_TOKEN_EXPIRATION,
  AUTH_TOKEN_EXPIRATION,
  REFRESH_TOKEN,
  SECRET_TOKEN,
} = require("../util/config");

const USER = "user";

let userService = {};

userService.signin = async (data) => {
  const model = connect.userSchema;
  const validationResponse = validateSignupSignin(data);
  if (validationResponse.error) {
    throw createError(400, validationResponse.error.message);
  }
  const result = await model.findOne({ email: data.email });
  if (!result) {
    throw createError(400, "Invalid Credentials");
  }
  if (await bcrypt.compare(data.password, result.password)) {
    const payload = { email: result.email, userId: result.userId };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    if (await addToken(refreshToken))
      return {
        accessToken,
        refreshToken,
        email: result.email,
        userId: result.userId,
      };
    throw createError(500, "Something went wrong");
  } else {
    throw createError(401, "Invalid Password");
  }
};

userService.signup = async (data) => {
  const model = connect.userSchema;
  const validationResponse = validateSignupSignin(data);
  if (validationResponse.error) {
    throw createError(400, validationResponse.error.message);
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);
  data = {
    ...data,
    password: hashedPassword,
    userId: await generateUserId(),
  };
  const result = await model.create(data);
  if (result) {
    return true;
  }
};

userService.refreshToken = async (refreshToken) => {
  const validationResponse = validateToken(refreshToken);
  if (validationResponse.error) {
    throw createError(400, validationResponse.error.message);
  }
  const model = connect.tokenSchema;
  const { token } = refreshToken;
  if (!(await model.findOne({ token }))) {
    throw createError(403);
  }
  return jwt.verify(token, REFRESH_TOKEN, (err, user) => {
    if (err) throw createError(403);
    const accessToken = generateToken({
      email: user.email,
      userId: user.userId,
    });
    return { accessToken, email: user.email };
  });
};

userService.logout = async (token) => {
  const validationResponse = validateToken(token);
  if (validationResponse.error) {
    throw createError(400, validationResponse.error.message);
  }
  const result = await removeToken(token.token);
  if (result.deletedCount) {
    return { result };
  } else {
    throw new createError(404, "Token not found");
  }
};

async function generateUserId() {
  const model = connect.generateSchema;
  const generateData = await model.findOne({ _id: USER });
  if (generateData) {
    generateData.seq += 1;
    await model.findOneAndUpdate({ _id: USER }, { $inc : {'seq' : 1}});
    return "U" + generateData.seq;
  } else {
    await model.create({ _id: USER, seq: 1 });
    return "U1";
  }
}

async function addToken(token) {
  const model = connect.tokenSchema;
  await model.create({ token: token });
  return true;
}

async function removeToken(token) {
  const model = connect.tokenSchema;
  return model.deleteOne({ token: token });
}

function generateToken(user) {
  return jwt.sign(user, SECRET_TOKEN, { expiresIn: AUTH_TOKEN_EXPIRATION });
}

function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_TOKEN, { expiresIn: REFRESH_TOKEN_EXPIRATION });
}

module.exports = userService;
