const audioUpload = (req, res, next) => {
  if (req.files == null || Object.keys(req.files).length === 0) {
    return res.status(400).json({err: 'No files sent'});
  }

  const file = req.files.file;

  const strTime = new Date().toLocaleString().replace(/\/| |,|:/gi, "-");

  const uploadPath = `audios/${strTime}-${file.name}`;

  file.mv(`${__dirname}/public/${uploadPath}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({err});
    }

    return res.json({
      fileName: file.name,
      filePath: uploadPath,
    });
  });
};

module.exports = audioUpload;