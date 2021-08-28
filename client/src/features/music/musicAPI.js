import clientAxios from "../../common/utils/clientAxios";

const musicAPI = {
  async getMusics() {
    return await clientAxios.get(`musics`);
  },
  async getMusic(id) {
    return await clientAxios.get(`musics/${id}`);
  },
  async setFavoriteToMusic(id, favorite) {
    return await clientAxios.put(`musics/${id}`, { favorite: favorite });
  },
  async deleteMusic(id) {
    return await clientAxios.delete(`musics/${id}`);
  },
  async editMusic(newData) {
    return await clientAxios.put(`musics/${newData._id}`, {...newData, _id: undefined});
  },
  async createMusic(newData) {
    return await clientAxios.post(`musics`, newData);
  },
  async uploadAudioFile(formData, options = {}) {
    return await clientAxios.post(`audio-upload`, formData, options);
  }
};

export default musicAPI;
