import { useRouter } from "next/router"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useUser } from "../../context/user"
import socket from "../../socket"
const Room = () => {

    const router = useRouter()
    const { token } = router.query
    const { currentUser, setCurrentUser } = useUser()
    const message = useRef<HTMLInputElement>(null)

    const [messageList, setMessageList] = useState<string[]>([])

    useEffect(() => {
        if (!currentUser) {
            let username = window.prompt("Username")
            if (setCurrentUser && username) {
                console.log(router.query)
                setCurrentUser({
                    username: username,
                    roomID: token as string
                })
            } else {
                username = window.prompt("Username")
            }
        }

        const userInfo = {
            username: currentUser?.username,
            roomID: token
        }

        console.log(userInfo)
        if (userInfo.roomID) {
            socket.emit('join', userInfo)
        }
    }, [token])

    useEffect(() => {
        socket.on("message", (m) => {
            console.log(m)
            console.log("It ran")
            setMessageList(prev => prev.concat(m))
        })

        socket.on("dis", (m) => {
            console.log(m)
        })
        socket.on("con", (m) => {
            console.log(m)
        })
        return () => {
            socket.disconnect()
        }
    }, [])

    const sendMessage = (e: FormEvent) => {
        e.preventDefault()
        const info = {
            username: "Joe",
            roomID: token,
            message: message.current?.value
        }

        socket.emit("message", info)
        if (message.current) {
            message.current.value = ""
        }
    }

    return (
        <div>
            {token}
            <form onSubmit={sendMessage}>
                <input type="text" ref={message} />
                <button type="submit">Send</button>
            </form>
            {
                messageList.map((message, i) => (
                    <h2 key={i}>{message}</h2>
                ))
            }
        </div>
    )
}

export default Room
