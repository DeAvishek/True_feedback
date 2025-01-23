import { promises } from "dns";
import mongoose from "mongoose";
import { type } from "os";

const mongo_uri = process.env.MONGO_URI

//define type of connection object isConnected type is number
type connectionObject = {
    isConnected?: number;
}
const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    } else {
        try {
            const db = await mongoose.connect(mongo_uri || "")
            connection.isConnected = db.connections[0].readyState
            console.log("Db connection succesfully")
            console.log(db.connections)

        } catch (error) {
            console.log("db connection failed with error.. ",error)
            process.exit(1)
        }
    }
}
export default dbConnect
