//router.query
import axios from "axios"
import { useRoom } from "context/room"
import { useUser } from "context/user"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import socket from "socket"
import { refreshToken } from "utils/refresh_token"
const Room: React.FC = ({ }) => {
    const { currentUser, setCurrentUser } = useUser()
    const { currentRoom, setCurrentRoom } = useRoom()
    const router = useRouter();
    const { id } = router.query
    const [error, setError] = useState(false)


    //? To get JWT Refresh token
    useEffect(() => {
        (async () => {
            if (!currentUser?.id) {
                const decoded = await refreshToken()
                console.log("USER", decoded)
                if (decoded) {
                    const { user } = decoded
                    if (setCurrentUser) {
                        console.log("User", user)
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
                if (id && typeof id === "string" && currentUser) {
                    const payload = {
                        userID: currentUser?.id,
                        id: id,
                        currentRoom: currentRoom,
                        displayName: currentUser?.displayName,
                        picture: currentUser?.picture
                    }
                    socket.emit("join", payload)
                    socket.emit("user-loged-on", { userID: currentUser.id })

                    /// ? TO CHECK IF ROO IS ALREADY JOINED
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/room/joinRoom`, { roomID: id }, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    })

                    console.log("Res", res)

                    if (!res.data.ok) {
                        setError(true)
                        return
                    }

                    if (setCurrentRoom) {
                        setCurrentRoom(id)
                        router.push("/dash")

                    }
                }
            }
        )()

    }, [currentUser, id])



    return (
        <div>
            {error &&
                <div
                    style={
                        {
                            height: "100vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",

                            color: "white"

                        }
                    }
                >
                    <h1>ERROR</h1>
                    <h2>Room may not exist</h2>
                </div>
            }
        </div>
    )
}

export default Room
