import mongoose from "mongoose";
import { config } from "./app.config";

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Mongo database connected");       
    } catch (error) {
        console.log("error on connecting to database");
        process.exit(1);        
    }
}

export default connectDatabase;