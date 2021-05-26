import { useRoom } from "context/room"
import { useUser } from "context/user"
import { FormEvent, useRef } from "react"
import { RiSendPlaneFill } from "react-icons/ri"
import socket from "socket"
interface Props {

}

const MessageInput: React.FC<Props> = ({ }) => {

    const { currentUser } = useUser()
    const { currentRoom } = useRoom();
    const messageInput = useRef<HTMLInputElement>(null)

    const handleSend = (e: FormEvent) => {
        e.preventDefault()

        if (messageInput.current?.value.trim() === "") {
            return
        }

        const info = {
            roomID: currentRoom,
            message: messageInput.current?.value,
            userID: currentUser?.id,
            firstName: currentUser?.firstName,
            picture: currentUser?.picture
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
