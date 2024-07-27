import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to DB.");
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB Connection Error. Please make sure DB is up and Running.",
        err
      );
      process.exit();
    });

  } catch (error) {
    console.log(`Something went wrong while connecting DB. ${error}`);
  }
}
