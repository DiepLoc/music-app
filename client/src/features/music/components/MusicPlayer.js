import { AppBar, IconButton, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import getStaticUrl from "../../../common/utils/getStaticUrl";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayingStyle from "./PlayingStyle";
import { useSelector } from "react-redux";
import Localization from "../../../common/modules/Localization";

const useStyles = makeStyles((theme) => ({
  root: {
    top: "auto",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    background: "rgba(0,0,0,0.25)",
    "& > *": {
      marginRight: theme.spacing(2),
    },
  },
  musicInfo: {
    marginLeft: theme.spacing(1),
    fontStyle: "italic",
    width: 200,
    textAlign: 'right'
  },
  audio: {
    width: "100%",
    maxWidth: 400,
    minWidth: 300,
  },
  naviContainer: {
    borderRadius: 24,
  },
}));

const MusicPlayer = ({ relativeUrl, musicName, singer, goNext, goPrevious }) => {
  const classes = useStyles();
  const lang = useSelector(state => state.music.lang);
  const [loop, setLoop] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.addEventListener('ended', () => console.log(244241))
  }, [audioRef])

  return (
    <AppBar className={classes.root}>
      <div className={classes.musicInfo}>
        <Typography variant="subtitle1" noWrap>
          {musicName}
        </Typography>
        <Typography variant="body2" color="secondary">
          {Localization.field.singer}: {singer || "unknown"}
        </Typography>
      </div>
      <audio controls className={classes.audio} autoPlay loop={loop} ref={r => audioRef.current = r}>
        <source src={getStaticUrl(relativeUrl)} type="audio/mpeg" />
      </audio>
      <Paper className={classes.naviContainer}>
        <IconButton aria-label="previous" onClick={goPrevious}>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton aria-label="next" onClick={goNext}>
          <SkipNextIcon />
        </IconButton>
      </Paper>
      <PlayingStyle />
    </AppBar>
  );
};

export default MusicPlayer;
