import React, { useEffect, useState } from "react";
import { IconButton, List, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import musicAPI from "./musicAPI";
import MusicCatalogs from "./components/MusicCatalogs";
import MusicPlayer from "./components/MusicPlayer";
import MusicItem from "./components/MusicItem";
import MusicModal from "./components/MusicModal";
import AddIcon from "@material-ui/icons/Add";
import MusicPlayStyleHandler from "./MusicPlayStyleHandler";
import MusicSse from "./components/MusicSse";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  musics: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const Musics = () => {
  const classes = useStyles();
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingMusic, setPlayingMusic] = useState(null);
  const [isShowFavorite, setIsShowFavorite] = useState(false);

  const [editingMusicId, setEditingMusicId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadMusics = async () => {
      try {
        setLoading(true);
        const { data } = await musicAPI.getMusics();
        setMusics(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err.response?.data);
      }
    };
    loadMusics();
  }, []);

  const handlePlayNewAudio = (music) => {
    setPlayingMusic(music);
  };

  const handleSomthingWrong = (err) => {
    setLoading(false);
    console.log(err.response?.data);
  };

  const handleChangeFavoriteToMusic = async (id, newFavorite) => {
    try {
      setLoading(true);
      await musicAPI.setFavoriteToMusic(id, newFavorite);
      const cloneMusics = [...musics];
      const changedMusic = cloneMusics.find((m) => m._id === id);
      if (changedMusic) {
        changedMusic.favorite = newFavorite;
        setMusics(cloneMusics);
      }
      setLoading(false);
    } catch (err) {
      handleSomthingWrong(err);
    }
  };

  const handleDeleteMusic = async (id) => {
    try {
      setLoading(true);
      await musicAPI.deleteMusic(id);
      const newMusics = musics.filter((m) => m._id !== id);
      setMusics(newMusics);
      setLoading(false);
    } catch (err) {
      handleSomthingWrong(err);
    }
  };

  const onEditMusic = (id) => {
    setEditingMusicId(id);
    setShowModal(true);
  };

  const onCreateMusic = () => {
    setEditingMusicId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMusicId(null);
  };

  const handleSaveMusic = (newData) => {
    if (!!newData._id && !!editingMusicId) handleEditMusic(newData);
    else handleCreateMusic(newData);
  };

  const handleEditMusic = async (newData) => {
    try {
      setLoading(true);
      await musicAPI.editMusic(newData);
      const targetMusic = musics.find((m) => m._id === newData._id);
      setLoading(false);
      if (!targetMusic) return;
      Object.keys(newData).forEach((key) => (targetMusic[key] = newData[key]));
      setMusics([...musics]);
      handleCloseModal();
    } catch (err) {
      handleSomthingWrong(err);
    }
  };

  const handleCreateMusic = async (newMusic) => {
    try {
      setLoading(true);
      const { data } = await musicAPI.createMusic(newMusic);
      setMusics((old) => [...old, data]);
      setLoading(false);
      handleCloseModal();
    } catch (err) {
      handleSomthingWrong(err);
    }
  };

  const goNextMusic = () => {
    setPlayingMusic(
      MusicPlayStyleHandler.getNextMusic(musics, playingMusic, isShowFavorite)
    );
  };

  const goPreviousMusic = () => {
    setPlayingMusic(
      MusicPlayStyleHandler.getPreviousMusic(
        musics,
        playingMusic,
        isShowFavorite
      )
    );
  };

  const goRandomMusic = () => {
    setPlayingMusic(
      MusicPlayStyleHandler.getRandomMusic(musics, isShowFavorite)
    );
  };

  const syncUpdate = async (id) => {
    try {
      const { data } = await musicAPI.getMusic(id);
      const updatedMusic = musics.find((m) => m._id === data._id);
      Object.keys(data).forEach((key) => (updatedMusic[key] = data[key]));
      setMusics([...musics])
    } catch (err) {
      handleSomthingWrong(err);
    }
  };
  const syncAdd = async (id) => {
    try {
      const { data } = await musicAPI.getMusic(id);
      const checkMusic = musics.find((m) => m._id === data._id);
      if (checkMusic) return;
      setMusics([...musics, checkMusic])
    } catch (err) {
      handleSomthingWrong(err);
    }
  };
  const syncDelete = async (id) => {
    try {
      const checkMusic = musics.find((m) => m._id === id);
      if (!checkMusic) return;
      setMusics(old => old.filter(m => m._id !== id))
    } catch (err) {
      handleSomthingWrong(err);
    }
  };

  const renderedMusics = (function () {
    let cloneMusics = [...musics];
    if (isShowFavorite) cloneMusics = cloneMusics.filter((m) => m.favorite);
    cloneMusics.sort((a, b) => a.name.localeCompare(b.name));
    return cloneMusics.map((music) => {
      return (
        <MusicItem
          key={music._id}
          music={music}
          handleDeleteMusic={handleDeleteMusic}
          handleChangeFavoriteToMusic={handleChangeFavoriteToMusic}
          handlePlayNewAudio={handlePlayNewAudio}
          loading={loading}
          onEditMusic={onEditMusic}
        />
      );
    });
  })();

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={error != null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={typeof error === "string" ? error : "Faild."}
      />
      <MusicCatalogs setShowFavorite={setIsShowFavorite} />
      <IconButton aria-label="delete" onClick={onCreateMusic}>
        <AddIcon />
      </IconButton>
      {renderedMusics.length > 0 && (
        <List className={classes.musics}>{renderedMusics}</List>
      )}

      {playingMusic && (
        <MusicPlayer
          key={playingMusic._id}
          relativeUrl={playingMusic.url}
          musicName={playingMusic.name}
          singer={playingMusic.singder}
          goNext={goNextMusic}
          goPrevious={goPreviousMusic}
        />
      )}
      <MusicModal
        open={showModal}
        music={
          editingMusicId ? musics.find((m) => m._id === editingMusicId) : {}
        }
        handleClose={handleCloseModal}
        handleSave={handleSaveMusic}
      />
      <MusicSse cbUpdate={syncUpdate} cbAdd={syncAdd} cbDelete={syncDelete} />
    </div>
  );
};

export default Musics;
