import { useRoom } from "context/room"
import { useUser } from "context/user"
import { FormEvent, useRef, useState } from "react"
import { RiSendPlaneFill } from "react-icons/ri"
// import Picker from 'emoji-picker-react';
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

        if (messageInput.current?.value.startsWith("--")) {
            const flag = messageInput.current?.value.split(" ")[0].split("--")[1]
            const message = messageInput.current.value.split(`${flag} `)[1]
            const info = {
                roomID: currentRoom,
                message,
                flag,
                userID: currentUser?.id,
                firstName: currentUser?.firstName,
                picture: currentUser?.picture
            }

            socket.emit("message", info)

            if (messageInput.current) {
                messageInput.current.value = ""
            }

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
