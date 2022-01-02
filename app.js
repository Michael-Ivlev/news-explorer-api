const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();
const limiter = require('./limiter/limiter');
const mainRouter = require('./routes/index');
const NotFoundError = require('./errors/not_found');
const { notFoundErrorText } = require('./constants');

const { NODE_ENV, DB_ADRESS, devDbKey } = require('./config');

const { PORT = 3000 } = process.env;
const app = express();

// request logger
app.use(requestLogger);

app.use(cors());
app.options('*', cors());
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(`${NODE_ENV === 'production' ? DB_ADRESS : devDbKey}`)
  .then(() => console.log('Database connected!'))
  .catch((err) => console.log(err));

app.use('/', mainRouter);

app.get('*', (req, res) => {
  throw new NotFoundError(notFoundErrorText);
});
// error logger
app.use(errorLogger);

// celebrate error middleware
app.use(errors());

// central error middleware
app.use((err, req, res, next) => {
  console.log(err);
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // check the status and display a message based on it
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

app.listen(PORT, () => {
  console.log(`Listen on PORT ${PORT}`);
});
