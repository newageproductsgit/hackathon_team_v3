import { useEffect, useState } from 'react'
import io from 'socket.io-client'

function MyApp({ Component, pageProps }) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const initSocket = async () => {
      await fetch('/api/socket')
      const newSocket = io()
      setSocket(newSocket)
    }

    initSocket()

    return () => {
      if (socket) socket.disconnect()
    }
  }, [])

  return <Component {...pageProps} socket={socket} />
}

export default MyApp