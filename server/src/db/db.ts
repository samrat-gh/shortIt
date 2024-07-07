import mongoose from "mongoose";
const DB_NAME = "url-shortener";

const ConnectToDB = async () => {
  try {
    console.log("uri", process.env.MONGODB_URI);
    const userInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("DB connected :", userInstance.connection.host);
  } catch (err: any) {
    console.log("Error connecting to Databse");
    process.exit(1);
  }
};

export { ConnectToDB };
