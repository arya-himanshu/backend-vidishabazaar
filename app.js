import { get } from "./config/env.js";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import { mongodb } from "./config/database.js";
import cors from "cors";
import routes from "./routes/routes.js";
import apiErrorHandler from "./middleware/apiErrorHandler.js";
const { connect, connection } = mongoose;

// .env file configuration
get();

// Express initialization
const app = express();

// CORS initialization
app.use(cors());

// Helmet initialization
app.use(helmet());

// compress all responses
app.use(compression());

// MongoDB connection
connect(mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// On connection error
connection.on("error", (error) => {
  console.error("Database error: " + mongodb.uri);
});

// On successful connection
connection.on("connected", () => {
  console.log("Database connected");
});

// Body parser middleware
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", routes);

app.use(apiErrorHandler);

app.get("*", function (req, res) {
  res.send('<h1 style="color:red;text-align:center">Dost kahi bhatak gaye ho app.</h1>', 404);
});

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log("app running on port", port);
});
