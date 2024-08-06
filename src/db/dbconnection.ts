import mongoose from "mongoose";

const connectToMongoDb = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/deliveryStore")
    .then(() => console.log("Connected to DB successfully..."))
    .catch((error: Error) => console.error("Error connecting to DB:", error));
};

export default connectToMongoDb;
