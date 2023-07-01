import { get } from "./env.js";

get();
export const mongodb = {
  uri: `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/vidishabazaarDB`,
  username: process.env.MONGO_DB_USERNAME,
  password: process.env.MONGO_DB_PASSWORD,
};
