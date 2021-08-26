const mongoose = require("mongoose");

const MusicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    minlength: 1,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
  },
  creator: {
    type: String,
    minlength: 1,
  },
  singer: {
    type: String,
    minlength: 1,
  },
  favorite: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Music = mongoose.model('Musics', MusicSchema);

MusicSchema.static.transferFromBody = (bodyData) => {
  const { name, creator, singer, url, favorite } = bodyData;
  return { name, creator, singer, url, favorite };
}

module.exports = Music;