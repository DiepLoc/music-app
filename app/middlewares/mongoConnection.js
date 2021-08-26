const mongooes = require("mongoose");

const mongoConnection = () => {
  mongooes.connect(
    process.env.MONGO_CONNECTION_URL,
    { useNewUrlParser: true },
    () => {
      console.log("connected to DB!")
    }
  );
}

module.exports = mongoConnection;
