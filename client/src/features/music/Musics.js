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
import MusicSyncer from "./components/MusicSyncer";
import AppLocalization from "./components/AppLocalization";

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
    marginBottom: theme.spacing(7)
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
  const [currentStyle, setCurrentStyle] = useState(1);
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

  const handleSomethingWrong = (err) => {
    setLoading(false);
    console.log(err.response?.data);
  };

  const handleChangeFavoriteToMusic = async (id, newFavorite) => {
    try {
      setLoading(true);
      const { data } = await musicAPI.setFavoriteToMusic(id, newFavorite);
      const cloneMusics = [...musics];
      const changedMusic = cloneMusics.find((m) => m._id === id);
      if (changedMusic) {
        changedMusic.favorite = data.favorite;
        setMusics(cloneMusics);
      }
      setLoading(false);
    } catch (err) {
      handleSomethingWrong(err);
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
      handleSomethingWrong(err);
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
      const { data } = await musicAPI.editMusic(newData);
      const newMusics = [...musics].filter((m) => m._id !== data._id);
      newMusics.push(data);
      setMusics(newMusics);
      setLoading(false);
      handleCloseModal();
    } catch (err) {
      handleSomethingWrong(err);
    }
  };

  const handleCreateMusic = async (newMusic) => {
    try {
      setLoading(true);
      const { data } = await musicAPI.createMusic(newMusic);
      console.log("create", data);
      setMusics((old) => [...old, data]);
      setLoading(false);
      handleCloseModal();
    } catch (err) {
      handleSomethingWrong(err);
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

  const syncEdit = async (newMusic) => {
    try {
      const { data } = await musicAPI.getMusic(newMusic._id);
      const updatedMusic = musics.find((m) => m._id === data._id);
      Object.keys(data).forEach((key) => (updatedMusic[key] = data[key]));
      setMusics([...musics]);
    } catch (err) {
      handleSomethingWrong(err);
    }
  };
  const syncAdd = async (newMusic) => {
    try {
      const { data } = await musicAPI.getMusic(newMusic._id);
      const isExisted = musics.find((m) => m._id === data._id);
      if (isExisted) return;
      setMusics([...musics, data]);
    } catch (err) {
      handleSomethingWrong(err);
    }
  };
  const syncDelete = async (id) => {
    try {
      const isExisted = musics.find((m) => m._id === id);
      if (!isExisted) return;
      setMusics((old) => old.filter((m) => m._id !== id));
    } catch (err) {
      handleSomethingWrong(err);
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
          highlight={music._id === playingMusic?._id}
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

      <IconButton aria-label="add new music" onClick={onCreateMusic}>
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
          singer={playingMusic.singer}
          currentStyle={currentStyle}
          setCurrentStyle={setCurrentStyle}
          goNext={goNextMusic}
          goPrevious={goPreviousMusic}
          goRandom={goRandomMusic}
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
      <MusicSyncer
        syncAdd={syncAdd}
        syncEdit={syncEdit}
        syncDelete={syncDelete}
      />
      <AppLocalization />
    </div>
  );
};

export default Musics;
