import MainButton from "components/MainButton"
import ToggleSlider from "components/ToggleSlider"
import { useRoom } from "context/room"
import { useUser } from "context/user"
import { useFetch } from "hooks/useFetch"
import { AlertContext } from "pages/_app"
import { useContext, useEffect, useRef, useState } from "react"
import { GoSignOut } from "react-icons/go"
import socket from "socket"
import style from "./style.module.scss"
import UserInfo from "./UserInfo"



interface Props {

}

interface IOnlineClients {
    socketID: string,
    userID: string
}

const RoomInfo: React.FC<Props> = ({ }) => {

    const { setCurrentRoom, currentRoom } = useRoom()
    const { currentUser } = useUser()
    const { setAlert } = useContext(AlertContext)
    const [onlineUsers, setOnlineUsers] = useState<IOnlineClients[]>([])

    const [roomsUsers, setRoomsUsers] = useState<IRoomUsers[]>([])
    const roomInvitelink = useRef<HTMLTextAreaElement>(null)
    const [toggle, setToggle] = useState(false) //? For Mobile

    useEffect(() => {
        socket.emit("getOnlineClients", { userID: currentUser?.id })

        socket.on("online-clients", (data: { ok: boolean, clients: IOnlineClients[] }) => {
            if (data.ok)
                setOnlineUsers(data.clients)
        })

        socket.on("a-user-joined", (data: { ok: boolean, user: IRoomUsers }) => {
            if (data.ok) {
                setRoomsUsers(prev => prev.concat(data.user))
            }
        })

        socket.on("updateList", (data: { ok: boolean, userID: string }) => {
            if (data.ok) {
                setRoomsUsers(prev => prev.filter(user => user.userID !== data.userID))
            }
        })
    }, [])

    useEffect(() => {
        (
            async () => {
                const res = await useFetch
                    <{ ok: boolean, users: IRoomUsers[] }>
                    (
                        "GET",
                        "api/room/users",
                        { roomID: currentRoom }
                    )
                setRoomsUsers(res!.data.users)
            }
        )()
    }, [currentRoom])

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

    const isUserOnline = (userID: string) => {

        let isOnline = false;

        onlineUsers.forEach(users => {
            if (users.userID === userID) return isOnline = true
        })

        return isOnline
    }

    const handleCopyInvite = () => {
        roomInvitelink.current?.select()
        roomInvitelink.current?.setSelectionRange(0, 99999);
        document.execCommand("copy")
        if (setAlert) setAlert({
            type: "message",
            message: "Invite link copied"
        })
    }


    return (
        <div className={`${style.room_info_container} ${toggle ? style.active : ""}`}>
            <span>
                <ToggleSlider toggleSetState={setToggle} toggle={toggle} />
            </span>
            <div className={style.options}>
                <MainButton type="button" onClick={handleLeaveRoom}> <GoSignOut color="red" /> Leave Room</MainButton>
                <section>
                    <textarea cols={10} rows={1}
                        value={`${window.location.origin}/room/${currentRoom}`}
                        ref={roomInvitelink}
                        readOnly
                    />
                    <MainButton type={"button"} onClick={handleCopyInvite}>Copy Invite Link</MainButton>
                </section>
            </div>
            <div className={style.room_users}>
                {roomsUsers.length !== 0 &&
                    roomsUsers.map((users) => (
                        <UserInfo
                            key={users.userID}
                            picture={users.rooms.picture}
                            displayName={users.rooms.displayName}
                            online={isUserOnline(users.userID)}
                        />

                    ))
                }
            </div>
        </div>
    )
}

export default RoomInfo
