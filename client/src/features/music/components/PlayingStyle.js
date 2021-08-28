import RepeatOneIcon from '@material-ui/icons/RepeatOne';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import RepeatIcon from '@material-ui/icons/Repeat';
import LowPriorityOutlinedIcon from '@material-ui/icons/LowPriorityOutlined';
import { useState } from 'react';
import { Fab, Tooltip } from '@material-ui/core';

const playingStyles = [
  {
    order: 0,
    name: 'Replay current song',
    icon: <RepeatOneIcon />
  },
  {
    order: 1,
    name: 'Play in order',
    icon: <PlaylistPlayIcon />
  },
  {
    order: 2,
    name: 'Play in order and repeat the list',
    icon: <RepeatIcon />
  },
  {
    order: 3,
    name: 'Random play',
    icon: <LowPriorityOutlinedIcon />
  },
]

const PlayingStyle = () => {
  const [currentStyle, setCurrentStyle] = useState(0);

  const onNextStyle = () => {
    setCurrentStyle(pre => (pre + 1) % playingStyles.length);
  }

  return (
    <Tooltip title={playingStyles[currentStyle].name} onClick={onNextStyle}>
      <Fab color="primary" aria-label="playing style">
        {playingStyles[currentStyle].icon}
      </Fab>
    </Tooltip>
  )
}

export default PlayingStyle
