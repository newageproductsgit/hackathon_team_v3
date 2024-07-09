import { useEffect, useState } from 'react';

export default function RoomView() {
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.emit('get-room-data', roomId);

  //     socket.on('room-update', (room) => {
  //       setUsers(room.users);
  //     });

  //     return () => {
  //       socket.off('room-update');
  //     };
  //   }
  // }, [socket, roomId]);

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <h3>Users in this room:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
