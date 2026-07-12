import mongoose from "mongoose";

/**
 * Establish a connection to the MongoDB database.
 * The connection string is read from the MONGODB_URI environment variable
 * so the same code works against a local MongoDB or MongoDB Atlas.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit the process with failure so the problem is not silently ignored.
    process.exit(1);
  }
};

export default connectDB;
