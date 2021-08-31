const mongooes = require("mongoose");

const mongoConnection = () => {
  let mongoConnectUrl = process.env.DEV_MONGO_CONNECTION_URL;
  if (process.env.NODE_ENV === 'test') mongoConnectUrl = process.env.TEST_MONGO_CONNECTION_URL;

  mongooes.connect(
    mongoConnectUrl,
    { useNewUrlParser: true },
    () => {
      console.log("\t\t\tconnected to DB!")
    }
  );
}

module.exports = mongoConnection;
