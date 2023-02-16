import { connect, set } from "mongoose";
import config from "../config/config.js";


// MONGOOSE CONFIG.
// DBaaS
// username: mchristello
// contraseña: matinho87

export const connectMongo = async () => {
    try {
        set('strictQuery', false);
        await connect(config.MONGO_URL, { dbName: config.DB_NAME });

        console.log(`We are connected to MongoDB...!`);
        
    } catch (error) {
        if (error) {
            console.log(`We have a problema trying to connect with the DB: ${error.message}`);
            process.exit();
        }
    }
}