import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            dbName: "DHLDB",
        })
        .then(() => {
            console.log("Connected to database!");
        })
        .catch((err) => {
            console.log(
                `An error occurred while connecting to the database: ${err}`
            );
        });
};