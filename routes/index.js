const mainRouter = require('express').Router();
const userRouter = require('./users');
const articleRouter = require('./articles');

mainRouter.use('/', userRouter);
mainRouter.use('/', articleRouter);

module.exports = mainRouter;
