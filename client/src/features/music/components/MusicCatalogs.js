import { AppBar,  Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Localization from "../../../common/modules/Localization";
import { useSelector } from "react-redux";


const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    opacity: 0.85,
  },
}));

const MusicCalatogs = ({ setShowFavorite }) => {
  const classes = useStyles();
  const [tab, setTab] = React.useState(0);
  const lang = useSelector(state => state.music.lang);

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
        <Tab label={Localization.catalog.all} icon={<MusicNoteIcon />} />
        <Tab label={Localization.catalog.favorite} icon={<FavoriteIcon />} />
      </Tabs>
    </AppBar>
  );
};

export default MusicCalatogs;
