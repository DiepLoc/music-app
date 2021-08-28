const express = require("express");
const Music = require("../models/Music");
const router = express.Router();
const catchAsync = require("../libs/catchAsync");
const unlinkFile = require("../libs/unlinkFile");
const sse = require("../middlewares/mySse");

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    res.json(await Music.find());
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ err: "Music not found" });
    res.json(music);
  })
);

router.post(
  "/",
  catchAsync(async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ err: "Body cannot be empty." });
    }
    const { name, creator, singer, url, favorite } = req.body;
    const music = new Music({ name, creator, singer, url, favorite });
    const savedMusic = await music.save();
    try {
      sse.addSomething({data: savedMusic._id});
    }catch (err) {console.log(err)}
    res.json(savedMusic);
  })
);

router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { name, creator, singer, url, favorite } = req.body;

    const oldMusic = await Music.findByIdAndUpdate(req.params.id, {
      $set: { name, creator, singer, url, favorite },
    });

    if (typeof url === 'string' && oldMusic.url !== url) {
      unlinkFile(oldMusic.url);
    }
    
    sse.updateSomething({data: req.params.id})
    res.json(oldMusic);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const targetMusic = await Music.findById(req.params.id);
    if (!targetMusic) return res.status(404).json({ err: "Music not found" });

    const result = await Music.findByIdAndDelete(req.params.id);
    unlinkFile(result.url);

    sse.deleteSomething({data: req.params.id})
    res.json(result);
  })
);

module.exports = router;
