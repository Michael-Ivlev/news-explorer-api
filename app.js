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

const { NODE_ENV, DB_ADRESS, devDbKey } = require('./config');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors());
app.options('*', cors());
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(`${NODE_ENV === 'production' ? DB_ADRESS : devDbKey}`)
  // eslint-disable-next-line no-console
  .then(() => console.log('Database connected!'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));

// request logger
app.use(requestLogger);

app.use('/', mainRouter);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});
// error logger
app.use(errorLogger);

// celebrate error middleware
app.use(errors());

// central error middleware
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(err);
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // check the status and display a message based on it
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});
// eslint-disable-next-line no-console
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listen on PORT ${PORT}`);
});
