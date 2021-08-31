import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const MusicSyncer = ({syncAdd, syncEdit, syncDelete}) => {
  const [socket, setSocket] = useState(null);

  const addRef = useRef(null);
  const editRef = useRef(null);
  const deleteRef = useRef(null);

  useEffect(() => {
    addRef.current = syncAdd;
    editRef.current = syncEdit;
    deleteRef.current = syncDelete;
  }, [syncAdd, syncEdit, syncDelete])

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BASE_BACKEND_URL);
    newSocket.on("added music", newMusic => {
      addRef.current(newMusic)
    })
    newSocket.on("edited music", editedMusic => {
      editRef.current(editedMusic)
    })
    newSocket.on("deleted music", id => {
      deleteRef.current(id);
    })
    setSocket(newSocket);

    return () => newSocket.close();
  }, [])

  return null
}

export default MusicSyncer
