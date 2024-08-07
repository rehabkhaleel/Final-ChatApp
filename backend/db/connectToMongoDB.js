import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI)

    console.log("successful connection to MongoDB");
  } catch (error) {
    console.log("Error connecting to Mongo DB ", error.message);
  }
};
 export default connectToMongoDB;