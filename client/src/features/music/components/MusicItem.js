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
import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  inline: {
    display: "inline",
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
}) => {
  const classes = useStyles();
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
      <ListItem alignItems="flex-start">
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
                Singer: {music.singer || "unknown"}
              </Typography>
              {` — Creator: ${music.creator || "unknown"}`}
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
            <MenuItem onClick={() => onEdit(music._id)}>Edit</MenuItem>
            <MenuItem onClick={onDeleteMusic}>Delete</MenuItem>
          </Menu>
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div className={classes.deleteConfirm}>
              <Typography>
                Confirm deletion. Note: this is not recoverable
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                disableElevation
                onClick={() => handleDeleteMusic(music._id)}
                disabled={loading}
              >
                Confirm delete
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
            <MenuOutlinedIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default MusicItem;
