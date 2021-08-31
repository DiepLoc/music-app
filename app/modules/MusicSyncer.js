class MusicSyncer {
  static socket;

  static setSocket(socket) {
    this.socket = socket;
  }

  static sendEditedEvent(music) {
    this.socket.sendToAllUsers("edited music", music);
  }

  static sendAddedEvent(music) {
    this.socket.sendToAllUsers("added music", music);
  }

  static sendDeletedEvent(id) {
    this.socket.sendToAllUsers("deleted music", id);
  }
}

module.exports = MusicSyncer;