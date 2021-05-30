import axios from "axios"
import MainButton from "components/MainButton"
import { useRoom } from "context/room"
import { useUser } from "context/user"
import { useEffect, useState } from "react"
import { GoSignOut } from "react-icons/go"
import socket from "socket"
import UserInfo from "./UserInfo"
interface Props {

}

const RoomInfo: React.FC<Props> = ({ }) => {

    const { setCurrentRoom, currentRoom } = useRoom()
    const { currentUser } = useUser()
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])

    const [roomsUsers, setRoomsUsers] = useState<IRoomUsers[]>([])

    useEffect(() => {

        socket.emit("getOnlineClients", { userID: currentUser?.id })

        socket.on("user-loged-in", (data: { ok: boolean, clients: string[] }) => {
            if (data.ok)
                setOnlineUsers(data.clients)
        })
    }, [])

    useEffect(() => {
        (
            async () => {
                const res = await axios.
                    get("http://localhost:5000/api/room/users", {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        params: {
                            roomID: currentRoom
                        }
                    })
                setRoomsUsers(res.data.users)
                console.log("Impo", res.data)
            }
        )()
    }, [])

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
            {console.log(onlineUsers)}
            <MainButton type="button" onClick={handleLeaveRoom}> <GoSignOut color="red" /> Leave Room</MainButton>
            <>
                {
                    roomsUsers.map((users) => (
                        <UserInfo
                            key={users.userID}
                            picture={users.rooms.picture}
                            displayName={users.rooms.displayName}
                            online={false}
                        />
                    ))
                }
            </>
        </div>
    )
}

export default RoomInfo
