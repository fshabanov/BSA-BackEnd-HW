const dotenv = require('dotenv');
dotenv.config();

const {
  DATABASE_PORT,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_ACCESS_KEY,
  JWT_SECRET,
} = process.env;

if (
  !DATABASE_PORT ||
  !DATABASE_HOST ||
  !DATABASE_NAME ||
  !DATABASE_USER ||
  !DATABASE_ACCESS_KEY ||
  !JWT_SECRET
) {
  throw new Error('Environment variables should all be passed');
}

const ENV = {
  DB: {
    DATABASE: DATABASE_NAME,
    HOST: DATABASE_HOST,
    PORT: DATABASE_PORT,
    USER: DATABASE_USER,
    ACCESS_KEY: DATABASE_ACCESS_KEY,
  },
  JWT: {
    SECRET: JWT_SECRET,
  },
};

module.exports = { ENV };
