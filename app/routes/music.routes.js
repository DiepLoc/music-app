const express = require("express");
const Music = require("../models/Music");
const router = express.Router();
const catchAsync = require("../libs/catchAsync");

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
    if (!music) return res.status(404).json({err: 'Music not found'})
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
    res.json(savedMusic);
  })
);

router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { name, creator, singer, url, favorite } = req.body;
    const result = await Music.updateOne(
      { _id: req.params.id },
      { $set: { name, creator, singer, url, favorite } }
    );
    res.json(result);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const targetMusic = await Music.findById(req.params.id);
    if (!targetMusic) return res.status(404).json({ err: "Music not found" });

    const result = await Music.deleteOne({ _id: req.params.id });
    res.json(result);
  })
);

module.exports = router;
