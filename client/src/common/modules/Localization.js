import LocalizedStrings from "react-localization";

let Localization = new LocalizedStrings({
  en: {
    how: "How do you want your egg today?",
    catalog: {
      all: "ALL",
      favorite: "FAVORITE"
    },
    field: {
      singer: "Singer",
      creator: "Creator",
      name: "Name"
    },
    playStyle: {
      replayOne: "Replay current song",
      replayAll: "Play in order and repeat the list",
      random: "Random play",
    },
    menu: {
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      deleteConfirm: "confirm delete",
      deleteWarn: "Confirm deletion. Note: this is not recoverable",
      uploadAudio: "upload audio"
    },
    validation: {
      nameRequired: "Name is required",
      urlRequired: "Please upload a audio file"
    }
  },
  vi: {
    how: "how cái gì mà how",
    catalog: {
      all: "Tất cả",
      favorite: "Yêu thích"
    },
    field: {
      singer: "Ca sĩ",
      creator: "Sáng tác",
      name: "Tên"
    },
    playStyle: {
      replayOne: "Phát lại bài hiện tại",
      replayAll: "Phát toàn bộ danh sách và lặp lại",
      random: "Phát ngẫu nhiên",
    },
    menu: {
      edit: "Chỉnh sửa",
      delete: "Xóa",
      save: "Lưu",
      deleteConfirm: "Xác nhận xóa",
      deleteWarn: "Xác nhận xóa. Chú ý: điều này không thể hoàn tác",
      uploadAudio: "Chọn ca khúc"
    },
    validation: {
      nameRequired: "Tên không được bỏ trống",
      urlRequired: "Vui lòng chọn một tập tin nhạc"
    }
  },
});

Localization.setLanguage("en");

export default Localization;
