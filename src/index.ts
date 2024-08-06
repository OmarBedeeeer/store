import express, { Application } from "express";
import dotenv from "dotenv";
import connectToMongoDb from "./db/dbconnection";
import { AppError } from "./utils/errorhandler";
import userAuthRouter from "./models/user/router/user.router";
const app: Application = express();
dotenv.config();
app.use(express.json());
app.use("/user", userAuthRouter);
app.all("*", (req: any, res: any, next) => {
  throw new AppError("Can't find this Page", 404);
});

app.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
    });
  } else {
    const message =
      process.env.ENV === "production"
        ? "Internal Server Error"
        : error.message;

    console.error({ message: error.message, stack: error.stack, error });
    return res.status(500).json({
      message,
    });
  }
});

const port = process.env.PORT;

connectToMongoDb();

app.listen(port, () => console.log("App listening on port"));
