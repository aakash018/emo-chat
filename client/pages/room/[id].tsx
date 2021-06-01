//router.query
import axios from "axios"
import { useRoom } from "context/room"
import { useUser } from "context/user"
import { useRouter } from "next/router"
import { useEffect } from "react"
import socket from "socket"
import { refreshToken } from "utils/refresh_token"
const Room: React.FC = ({ }) => {
    const { currentUser, setCurrentUser } = useUser()
    const { currentRoom, setCurrentRoom } = useRoom()
    const router = useRouter();
    const { id } = router.query

    useEffect(() => {
        (async () => {
            if (!currentUser?.id) {
                const decoded = await refreshToken()
                if (decoded) {
                    const { user } = decoded
                    if (setCurrentUser) {
                        setCurrentUser(user)
                    }
                } else {
                    router.push("/")
                }
            }
        })()
    }, [])


    useEffect(() => {
        (
            async () => {
                console.log(currentUser)
                if (id && typeof id === "string" && currentUser) {
                    const payload = {
                        userID: currentUser?.id,
                        id: id,
                        currentRoom: currentRoom,
                        displayName: currentUser?.displayName,
                        picture: currentUser?.picture
                    }
                    console.log(payload)
                    socket.emit("join", payload)

                    const res = await axios.post("http://localhost:5000/api/room/joinRoom", { roomID: id }, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    console.log(res.data)
                    if (setCurrentRoom) {
                        console.log("ran")
                        setCurrentRoom(id)
                        router.push("/dash")

                    }
                }
            }
        )()

    }, [currentUser])



    return (
        <div>

        </div>
    )
}

export default Room
