import { connect, set } from "mongoose";


// MONGOOSE CONFIG.
// DBaaS
// username: mchristello
// contraseña: matinho87


const MONGO_URI = 'mongodb+srv://mchristello:matinho87@codercluster.e396lxc.mongodb.net/?retryWrites=true&w=majority';

export const connectMongo = async () => {
    try {
        set('strictQuery', false);
        await connect(MONGO_URI, { dbName: 'ecommerce' });

        console.log(`We are connected to MongoDB...!`);
        
    } catch (error) {
        if (error) {
            console.log(`We have a problema trying to connect with the DB: ${error.message}`);
            process.exit();
        }
    }
}