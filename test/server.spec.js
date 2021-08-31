const supertest = require("supertest");
const assert = require("assert");
const Music = require("../app/models/Music");
const { app } = require("../server");

const checkTheSameMusic = (expectMusic, returnedMusic) => {
  if (typeof expectMusic !== 'object' || typeof returnedMusic !== 'object') return false;

  Object.keys(expectMusic).forEach((key) => {
    if (expectMusic[key] !== returnedMusic[key])
      return false;
  });

  return true;
}


describe("MUSIC MODULE", function() {
  this.timeout(8000);
  const musicIdNotExist = '612e513bfd7019b68c090000';

  const newMusic = {
    name: "new name",
    singer: "new singer",
    creator: "new creator",
    url: "someurl.mp3",
    favorite: true,
  };

  const oldMusic = {
    _id: "612e513bfd7019b68c096658",
    name: "old name",
    singer: "old singer",
    creator: "old creator",
    url: "someoldurl.mp3",
    favorite: false,
  };

  before(function waitForDBConnection(done) {
    this.timeout(4000);
    setTimeout(done, 3000);
  });

  beforeEach(function clearMusics(done) {
    Music.deleteMany()
      .then(() => done())
      .catch(done);
  });

  beforeEach(function initialSomeMusics(done) {
    Music.create(oldMusic)
      .then(() => done())
      .catch(done);
  });

  describe("GET MUSICS", function () {
    it("it should has status code 200 and json data", function (done) {
      supertest(app)
        .get("/musics")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should return array data with some musics", function (done) {
      supertest(app)
        .get("/musics")
        .set("Accept", "application/json")
        .expect(200)
        .expect(function (res) {
          if (!Array.isArray(res.body)) throw new Error("Body isn't array");
          if (!checkTheSameMusic(oldMusic, res.body[0])) throw new Error("Returned data does not match");
        })
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });
  });

  describe("GET MUSIC", function () {
    it("it should has status code 200 and json data", function (done) {
      supertest(app)
        .get(`/musics/${oldMusic._id}`)
        .expect(200)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should return a music correctly", function (done) {
      supertest(app)
        .get(`/musics/${oldMusic._id}`)
        .expect(200)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function(res) {
          if (!checkTheSameMusic(oldMusic, res.body)) throw new Error("Returned data does not match");
        })
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should has code status 404 when get the music doesn't exist", function (done) {
      supertest(app)
        .get(`/musics/${musicIdNotExist}`)
        .set("Accept", "application/json")
        .set(newMusic)
        .expect(404)
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });
  });

  describe("POST MUSIC", function () {
    this.beforeEach(function(done) {
      Music.deleteMany().then(() => done()).catch(done);
    })

    it("it should has status code 201 and json data", function (done) {
      supertest(app)
        .post("/musics")
        .set("Accept", "application/json")
        .send(newMusic)
        .expect(201)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should return the new music correctly", function (done) {
      supertest(app)
        .post("/musics")
        .set("Accept", "application/json")
        .send(newMusic)
        .expect(201)
        .expect("Content-Type", /json/)
        .expect(function (res) {
          if (!checkTheSameMusic(newMusic, res.body)) throw new Error("Wrong return data");
        })
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should return failure status with 400 code and error message correctly when passing empty body", function (done) {
      supertest(app)
        .post("/musics")
        .set("Accept", "application/json")
        .send({})
        .expect(400)
        .expect("Content-Type", /json/)
        .expect(function (res) {
          if (!res.body?.err === "Body cannot be empty.")
            throw new Error("Incorrect error message");
        })
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should return failure status with 400 code when not passing name to body", function (done) {
      supertest(app)
        .post("/musics")
        .set("Accept", "application/json")
        .send({ ...newMusic, name: null })
        .expect(400)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });
  });

  describe("EDIT MUSIC", function () {
    it("it should has status code 200 and json data", function (done) {
      supertest(app)
        .put(`/musics/${oldMusic._id}`)
        .set("Accept", "application/json")
        .set(newMusic)
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should return new music correctly", function (done) {
      supertest(app)
        .put(`/musics/${oldMusic._id}`)
        .set("Accept", "application/json")
        .set(newMusic)
        .expect(200)
        .expect(function (res) {
          if (!checkTheSameMusic(newMusic, res.body)) throw new Error("Wrong return data");
        })
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should has code status 404 when edit the music doesn't exist", function (done) {
      supertest(app)
        .put(`/musics/${musicIdNotExist}`)
        .set("Accept", "application/json")
        .set(newMusic)
        .expect(404)
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });
  });

  describe("DELETE MUSIC", function () {
    it("it should has code status 404 when delete the music doesn't exist", function (done) {
      supertest(app)
        .delete(`/musics/${musicIdNotExist}`)
        .set("Accept", "application/json")
        .expect(404)
        .expect({err: "Music not found."})
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });

    it("it should has code status 200 and send deleted music correctly", function (done) {
      supertest(app)
        .delete(`/musics/${oldMusic._id}`)
        .set("Accept", "application/json")
        .expect(200)
        .expect(function(res) {
          if (!checkTheSameMusic(oldMusic, res.body)) throw new Error("Wrong return data");
        })
        .end(function (err, res) {
          if (err) done(err);
          else done();
        });
    });
  });
});
