const createError = require('http-errors')
const router = require('express').Router();
const userService = require('../service/userService');
const authorization = require('../util/authorize');


router.post('/signin', (req, res, next) => {
    userService.signin(req.body).then(result => {
        res.status(200).send({message: "Logged In", result})
    }).catch(err => {
        next(err)
    })
})

router.post('/signup', (req, res, next) => {
    userService.signup(req.body).then(result => {
        res.status(200).send({message: "Added Successful", result})
    }).catch(err => {
        next(err.code === 11000 ? createError(409, "Email already Used") : err)
    })
})

router.post('/refresh-token', (req, res, next) => {
    userService.refreshToken(req.body).then(result => {
        res.status(200).send({message: "success", result})
    }).catch(err => {
        next(err)
    })
})

router.post("/logout", authorization, (req, res, next) => {
    userService.logout(req.body).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        next(err)
    })
})

module.exports = router