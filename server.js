const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const audioUpload = require("./app/middlewares/audioUpload");
const mongoConnection = require("./app/middlewares/mongoConnection");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const musicRoutes = require("./app/routes/music.routes");
const http = require("http");
const SocketIO = require("./app/modules/SocketIO");
const MusicSyncer = require("./app/modules/MusicSyncer");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// set up swagger
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API for Music application",
		},
		servers: [
			{
				url: "http://localhost:5000",
			},
		],
	},
	apis: ["./app/routes/*.js"],
};

const specs = swaggerJsDoc(options);

// swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
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

// set up socket for application
SocketIO.initialSocketAndEvents(server);
MusicSyncer.setSocket(SocketIO);

// home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

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
  res.status(400).json({ err });
});

module.exports = { server, app };
