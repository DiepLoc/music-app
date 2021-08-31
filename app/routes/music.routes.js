const express = require("express");
const Music = require("../models/Music");
const router = express.Router();
const catchAsync = require("../libs/catchAsync");
const unlinkFile = require("../libs/unlinkFile");
const MusicSyncer = require("../modules/MusicSyncer");

/**
 * @swagger
 * components:
 *   schemas:
 *     Music:
 *       type: object
 *       required:
 *         - name
 *         - url
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the music
 *         name:
 *           type: string
 *           description: The music name
 *         url:
 *           type: string
 *           description: The music url
 *         singer:
 *           type: string
 *           description: The singer of song
 *         creator:
 *           type: string
 *           description: The creator of song
 *         favorite:
 *           type: boolean
 *           description: Music is favorite
 *       example:
 *         _id: 612e513bfd7019b68c096658
 *         name: The day you went away
 *         url: the-day.mp3
 *         singer: some singer
 *         creator: some author
 *         favorite: true
 */

/**
  * @swagger
  * tags:
  *   name: Musics
  *   description: The musics managing API
  */

/**
 * @swagger
 * /musics:
 *   get:
 *     summary: Returns the list of all the musics
 *     tags: [Musics]
 *     responses:
 *       200:
 *         description: The list of the musics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Music'
 */

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    res.json(await Music.find());
  })
);

/**
 * @swagger
 * /musics/{id}:
 *   get:
 *     summary: Get the music by id
 *     tags: [Musics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The music id
 *     responses:
 *       200:
 *         description: The music description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Music'
 *       404:
 *         description: The music was not found
 */


router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ err: "Music not found." });
    res.json(music);
  })
);

/**
 * @swagger
 * /musics:
 *   post:
 *     summary: Create a new music
 *     tags: [Musics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Music'
 *     responses:
 *       200:
 *         description: The music was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Music'
 *       400:
 *         description: Something wrong from client
 */

router.post(
  "/",
  catchAsync(async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ err: "Body cannot be empty." });
    }
    const { name, creator, singer, url, favorite } = req.body;
    const music = new Music({ name, creator, singer, url, favorite });
    const savedMusic = await music.save();

    MusicSyncer.sendAddedEvent(savedMusic);
    res.status(201).json(savedMusic);
  })
);

/**
 * @swagger
 * /musics/{id}:
 *  put:
 *    summary: Update the music by the id
 *    tags: [Musics]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The music id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Music'
 *    responses:
 *      200:
 *        description: The music was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Music'
 *      400:
 *        description: Something wrong from client
 *      404:
 *        description: The music was not found
 */

router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { name, creator, singer, url, favorite } = req.body;

    const oldMusic = await Music.findById(req.params.id);
    if (!oldMusic) return res.status(404).json({ err: "Music not found." });

    await Music.updateOne(
      { _id: req.params.id },
      {
        $set: { name, creator, singer, url, favorite },
      }
    );

    if (typeof url === "string" && oldMusic.url !== url) {
      unlinkFile(oldMusic.url);
    }

    const newMusic = await Music.findById(req.params.id);
    MusicSyncer.sendEditedEvent(newMusic);
    res.json(newMusic);
  })
);

/**
 * @swagger
 * /musics/{id}:
 *   delete:
 *     summary: Remove the music by id
 *     tags: [Musics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The music id
 * 
 *     responses:
 *       200:
 *         description: The music was deleted
 *       400:
 *         description: Something wrong from client
 *       404:
 *         description: The music was not found
 */

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const targetMusic = await Music.findById(req.params.id);
    if (!targetMusic) return res.status(404).json({ err: "Music not found." });

    const result = await Music.findByIdAndDelete(req.params.id);
    unlinkFile(result.url);

    MusicSyncer.sendDeletedEvent(req.params.id);
    res.json(result);
  })
);

module.exports = router;
