const { Server } = require("socket.io");

class SocketIO {
  static io;

  static initialSocketAndEvents(server) {
    this.#initialSocket(server);
    this.#initialEvents();
  }

  static #initialSocket(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }

  static #initialEvents() {
    this.io.on("connection", (socket) => {
      console.log("A user has connected");
      socket.on("disconnect", () => {
        console.log("A user has disconnected");
      });
    });
  }

  static sendToAllUsers(eventName, data = {}) {
    this.io.emit(eventName, data);
  }
}

module.exports = SocketIO;
