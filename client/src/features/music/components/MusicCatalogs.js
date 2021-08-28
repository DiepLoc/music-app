import { AppBar,  Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import FavoriteIcon from "@material-ui/icons/Favorite";


const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    opacity: 0.85,
  },
}));

const MusicCalatogs = ({ setShowFavorite }) => {
  const classes = useStyles();
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newTab) => {
    setShowFavorite(newTab === 1);
    setTab(newTab);
  };

  return (
    <AppBar color="default" className={classes.root}>
      <Tabs
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="All" icon={<MusicNoteIcon />} />
        <Tab label="Favorite" icon={<FavoriteIcon />} />
      </Tabs>
    </AppBar>
  );
};

export default MusicCalatogs;
