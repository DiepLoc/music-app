import { Button, Drawer, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DropzoneDialog } from "material-ui-dropzone";
import musicAPI from "../musicAPI";
import { useSelector } from "react-redux";
import Localization from "../../../common/modules/Localization";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    background: "transparent",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    "& > *": {
      marginRight: theme.spacing(1),
      flexGrow: 1,
    },
  },
}));

const MusicModal = ({ music, open, handleClose, handleSave }) => {
  const classes = useStyles();
  const lang = useSelector((state) => state.music.lang);
  const [buffer, setBuffer] = useState({});
  const [error, setError] = useState(null);
  const [showDropzone, setShowDropsoze] = useState(false);

  useEffect(() => {
    if (!music || Object.keys(music).length === 0) {
      setBuffer({});
    } else {
      setBuffer({ ...music });
    }
    setError(null);
  }, [music]);

  const handleChangeDataField = (field, value) => {
    const trimedValue = value.trimStart();
    setError(null);
    setBuffer((old) => {
      return { ...old, [field]: trimedValue };
    });
  };

  const onSave = () => {
    if (!buffer.name) return setError(Localization.validation.nameRequired);
    if (!buffer.url) return setError(Localization.validation.urlRequired);
    handleSave(buffer);
  };

  const handleSaveAudio = async (files) => {
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await musicAPI.uploadAudioFile(formData);

      setShowDropsoze(false);
      setBuffer((old) => {
        if (!old.name) return { ...old, name: file.name, url: data.filePath };
        return { ...old, url: data.filePath };
      });
    } catch (err) {
      console.log(err.response);
      setError("File upload failed");
    }
  };

  return (
    <Drawer anchor="top" open={open} onClose={handleClose}>
      <div className={classes.root}>
        {["name", "singer", "creator"].map((field) => {
          return (
            <TextField
              key={field}
              label={Localization.field[field]?.firstCharToUppercase()}
              value={buffer[field] || ""}
              onChange={(e) => handleChangeDataField(field, e.target.value)}
              variant="outlined"
            />
          );
        })}
        {!buffer.url && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowDropsoze(true)}
          >
            {Localization.menu.uploadAudio}
          </Button>
        )}
        <DropzoneDialog
          open={showDropzone}
          onSave={handleSaveAudio}
          acceptedFiles={["image/jpeg", "image/png", "image/bmp", "audio/mpeg"]}
          showPreviews={true}
          maxFileSize={10000000}
          onClose={() => setShowDropsoze(false)}
          filesLimit={1}
        />
      </div>
      {error && (
        <Typography align="center" color="secondary">
          {error}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={onSave}>
        {Localization.menu.save}
      </Button>
    </Drawer>
  );
};

export default MusicModal;
