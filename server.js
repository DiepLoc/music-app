const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const audioUpload = require("./app/middlewares/audioUpload");
const mongoConnection = require("./app/middlewares/mongoConnection");
const musicRoutes = require("./app/routes/music.routes");
const sse = require("./app/middlewares/mySse");

require("dotenv").config();
const app = express();

// upload
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
// turn on CORS
app.use(cors());
// use static
app.use(express.static("public"));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// connect to mongoDB in cloud
mongoConnection();

// home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// listen for sync with sse
app.get('/sync', sse.init);

// main routes
app.use("/musics", musicRoutes);

// add my audioupload middleware
app.post("/audio-upload", audioUpload);

// bad request
app.all("*", (req, res, next) => {
  res
    .status(404)
    .json({ err: `Can't find ${req.originalUrl} on this server!` });
});

// error handler
app.use((err, req, res, next) => {
  res.status(400).json({err})
})

// start server with default port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
