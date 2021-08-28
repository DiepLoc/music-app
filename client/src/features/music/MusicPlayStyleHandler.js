class MusicPlayStyles {
  static getSortedMusics(musics, checkFavorite) {
    let sortedCloneMusic = [...musics].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    if (checkFavorite)
      sortedCloneMusic = sortedCloneMusic.filter((m) => m.favorite === true);
    return sortedCloneMusic;
  }

  static getNextOrPreviousMusic(musics, music, checkFavorite, isNext = true) {
    const sortedCloneMusic = this.getSortedMusics(musics, checkFavorite);
    if (sortedCloneMusic.length === 0) return null;

    const foundMusic = sortedCloneMusic.find((m) => m._id === music._id);
    if (!foundMusic) return sortedCloneMusic[0];

    const foundMusicIndex = sortedCloneMusic.indexOf(foundMusic);
    const increateIndex = isNext ? 1 : -1;
    const targetIndex =
    (foundMusicIndex + increateIndex + sortedCloneMusic.length) %
    sortedCloneMusic.length;
    
    console.log(targetIndex)
    return sortedCloneMusic[targetIndex];
  }

  static getRandomMusic(musics, checkFavorite) {
    let sortedCloneMusic = this.getSortedMusics(musics, checkFavorite);
    if (sortedCloneMusic.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * sortedCloneMusic.length);
    return sortedCloneMusic[randomIndex];
  }

  static getNextMusic(musics, music, checkFavorite) {
    return this.getNextOrPreviousMusic(musics, music, checkFavorite, true);
  }

  static getPreviousMusic(musics, music, checkFavorite) {
    return this.getNextOrPreviousMusic(musics, music, checkFavorite, false);
  }
};

export default MusicPlayStyles;
