import React, { useEffect, useRef, useState } from 'react'

const MusicSse = ({cbUpdate, cbAdd, cbDelete}) => {
  const [es, setEs] = useState(null);

  const updateRef = useRef(null)
  const addRef = useRef(null)
  const deleteRef = useRef(null)

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_BASE_BACKEND_URL}sync`);
    setEs(eventSource);
  }, [])

  useEffect(() => {
    if (!es) return;
    if (updateRef.current) es.removeEventListener("update", updateRef.current);
    if (addRef.current) es.removeEventListener("add", addRef.current);
    if (deleteRef.current) es.removeEventListener("delete", deleteRef.current);

    updateRef.current = es.addEventListener("update", function (event) {
      const id = JSON.parse(event.data).data;
      if (typeof id === 'string')
        cbUpdate(id)
    });
    addRef.current = es.addEventListener("add", function (event) {
      const id = JSON.parse(event.data).data;
      console.log(id)
      if (typeof id === 'string')
        cbAdd(id)
    });
    deleteRef.current = es.addEventListener("delete", function (event) {
      const id = JSON.parse(event.data).data;
      if (typeof id === 'string')
        cbDelete(id)
    });
  }, [es, cbUpdate, cbAdd, cbDelete])

  return null;
}

export default MusicSse
