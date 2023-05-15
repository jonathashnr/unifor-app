const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.ATLAS_URI);
        console.log(
            "Database conectado em ",
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDb;
