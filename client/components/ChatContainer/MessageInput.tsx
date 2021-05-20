import { useUser } from "context/user"
import { getCurrentRoom } from "libs/room"
import { FormEvent, useRef } from "react"
import { RiSendPlaneFill } from "react-icons/ri"
import socket from "socket"
interface Props {

}

const MessageInput: React.FC<Props> = ({ }) => {

    const { currentUser } = useUser()
    const messageInput = useRef<HTMLInputElement>(null)

    const handleSend = (e: FormEvent) => {
        e.preventDefault()
        const info = {
            username: currentUser?.firstName,
            roomID: getCurrentRoom(),
            message: messageInput.current?.value,
        }

        socket.emit("message", info)
        if (messageInput.current) {
            messageInput.current.value = ""
        }
    }


    return (
        <>
            <form onSubmit={handleSend} style={{ position: "absolute", bottom: "10px" }}>
                <input type="text" ref={messageInput} />
                <button type="submit" ><RiSendPlaneFill /></button>
            </form>
        </>
    )
}

export default MessageInput