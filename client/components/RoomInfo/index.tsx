import MainButton from "components/MainButton"
import { useRoom } from "context/room"
import { useUser } from "context/user"
import { GoSignOut } from "react-icons/go"
import socket from "socket"
interface Props {

}

const RoomInfo: React.FC<Props> = ({ }) => {

    const { setCurrentRoom, currentRoom } = useRoom()
    const { currentUser } = useUser()

    const handleLeaveRoom = () => {

        const payload = {
            userID: currentUser?.id,
            roomID: currentRoom
        }

        socket.emit("user-left-room", payload)
        if (setCurrentRoom) {
            setCurrentRoom(null)
        }
    }


    return (
        <div>
            <MainButton type="button" onClick={handleLeaveRoom}> <GoSignOut color="red" /> Leave Room</MainButton>
        </div>
    )
}

export default RoomInfo
