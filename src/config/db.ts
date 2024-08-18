import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.DATABASE_URL);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors.green.bold(`MongoDB conectado en: ${url}`));
    } catch (error) {
        console.log(colors.red.bold(`Error al conectar a MongoDB: ${error.message}`));

        console.error(error.stack);
        process.exit(1);
    }
};