import { useRouter } from 'next/router'
import RoomView from '../../components/RoomView'

export default function Room({ socket }) {
  const router = useRouter()
  const { id } = router.query

  if (!id) return <p>Loading...</p>

  return <RoomView socket={socket} roomId={id} />
}