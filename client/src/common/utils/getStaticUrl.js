const getStaticUrl = (src) => {
  return src ? `${process.env.REACT_APP_BASE_BACKEND_URL}/${src}` : null;
}

export default getStaticUrl
