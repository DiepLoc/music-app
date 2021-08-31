import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import RepeatIcon from "@material-ui/icons/Repeat";
import LowPriorityOutlinedIcon from "@material-ui/icons/LowPriorityOutlined";
import { useMemo, useState } from "react";
import { Fab, Tooltip, Typography } from "@material-ui/core";
import Localization from "../../../common/modules/Localization";
import { useSelector } from "react-redux";

const PlayingStyle = () => {
  const [currentStyle, setCurrentStyle] = useState(0);
  const lang = useSelector(state => state.music.lang);

  const playingStyles = useMemo(() => [
    {
      order: 0,
      name: Localization.playStyle.replayOne,
      icon: <RepeatOneIcon />,
    },
    {
      order: 1,
      name: Localization.playStyle.replayAll,
      icon: <RepeatIcon />,
    },
    {
      order: 2,
      name: Localization.playStyle.random,
      icon: <LowPriorityOutlinedIcon />,
    },
  ], [lang]);

  const onNextStyle = () => {
    setCurrentStyle((pre) => (pre + 1) % playingStyles.length);
  };

  return (
    <Tooltip
      title={<Typography>{playingStyles[currentStyle].name}</Typography>}
      onClick={onNextStyle}
    >
      <Fab color="primary" aria-label="playing style">
        {playingStyles[currentStyle].icon}
      </Fab>
    </Tooltip>
  );
};

export default PlayingStyle;
