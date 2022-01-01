// Env and dev default
const { NODE_ENV } = process.env;
const { JWT_SECRET } = process.env;
const { DB_ADRESS } = process.env;
const devPrivateKey = 'dev-secret';
const devDbKey = 'mongodb://localhost:27017/newsexplorer';

module.exports = {
  NODE_ENV,
  DB_ADRESS,
  JWT_SECRET,
  devPrivateKey,
  devDbKey,
};
