import express, { Application } from "express";
import dotenv from "dotenv";

const app: Application = express();
dotenv.config();
const port = process.env.PORT;
app.listen(port, () => console.log("App listening on port!"));
