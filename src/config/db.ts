import mongoose from "mongoose";

let isConnected = false;

export const connectMongoDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.DATABASE_URL!,
            //  {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            //  }
        );
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
    }
};