import {
  Avatar,
  Button,
  Dialog,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteOutlined";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Localization from "../../../common/modules/Localization";

const useStyles = makeStyles((theme) => ({
  inline: {
    display: "inline",
  },
  highlight: {
    background: '#CCC',
  },
  deleteConfirm: {
    padding: theme.spacing(2),
  },
}));

const MusicItem = ({
  music,
  handleChangeFavoriteToMusic,
  handlePlayNewAudio,
  handleDeleteMusic,
  loading,
  onEditMusic,
  highlight = false,
}) => {
  const classes = useStyles();
  const lang = useSelector(state => state.music.lang);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleSetEl = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const onDeleteMusic = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const onEdit = (id) => {
    handleCloseMenu();
    onEditMusic(id);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  return (
    <React.Fragment>
      <ListItem alignItems="flex-start" className={highlight ? classes.highlight : ''}>
        <ListItemAvatar>
          <Avatar alt={music.name} src="">
            {music.name[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={music.name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {Localization.field.singer}: {music.singer || "unknown"}
              </Typography>
              {` — ${Localization.field.creator}: ${music.creator || "unknown"}`}
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <Menu
            id="simple-menu"
            anchorEl={anchorMenuEl}
            keepMounted
            open={Boolean(anchorMenuEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => onEdit(music._id)}>{Localization.menu.edit}</MenuItem>
            <MenuItem onClick={onDeleteMusic}>{Localization.menu.delete}</MenuItem>
          </Menu>
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div className={classes.deleteConfirm}>
              <Typography>
              {Localization.menu.deleteWarn}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                disableElevation
                onClick={() => handleDeleteMusic(music._id)}
                disabled={loading}
              >
                {Localization.menu.deleteConfirm}
              </Button>
            </div>
          </Dialog>

          <IconButton
            edge="end"
            aria-label="is favorite"
            onClick={() =>
              handleChangeFavoriteToMusic(music._id, !music.favorite)
            }
          >
            {music.favorite ? (
              <FavoriteOutlinedIcon />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
          </IconButton>
          <IconButton
            edge="end"
            aria-label="play music"
            onClick={() => handlePlayNewAudio(music)}
          >
            <PlayArrowRoundedIcon />
          </IconButton>
          <IconButton edge="end" aria-label="play music" onClick={handleSetEl}>
            <MoreHorizIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default MusicItem;
