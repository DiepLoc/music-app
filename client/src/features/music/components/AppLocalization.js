import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, Select } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { changeLang } from "../musicSlice";
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(10),
    background: theme.palette.background.paper,
    opacity: 0.75,
    padding: theme.spacing(1)
  },
  margin: {
    marginRight: theme.spacing(1)
  }
}));

const AppLocalization = () => {
  const classes = useStyles();
  const lang = useSelector((state) => state.music.lang);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const newLang = e.target.value;
    dispatch(changeLang(newLang));
  };

  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={lang}
      variant='standard'
      onChange={handleChange}
      className={classes.root}
      startAdornment={<LanguageIcon className={classes.margin}/>}
    >
      <MenuItem value={"en"}>English</MenuItem>
      <MenuItem value={"vi"}>Tiếng việt</MenuItem>
    </Select>
  );
};

export default AppLocalization;
