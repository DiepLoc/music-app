import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Localization from '../../common/modules/Localization';

const initialState = {
  lang: Localization.getLanguage()
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    changeLang: (state, action) => {
      state.lang = action.payload;
      Localization.setLanguage(action.payload);
    },
  },
});
export const selectLang = (state) => state.music.lang;
export const { changeLang } = musicSlice.actions;
export default musicSlice.reducer;