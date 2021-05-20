import { useEffect, useState } from "react"
import socket from "socket"
import MessageInput from "./MessageInput"
import style from "./style.module.scss"

interface Props {

}



const ChatSection: React.FC<Props> = ({ }) => {

    const [messages, setMessages] = useState<IMessage[]>([])

    useEffect(() => {
        socket.on("message", (data: IMessage) => {
            setMessages(prev => prev.concat(data))
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <div className={style.chat_section}>
            <ul>
                {messages.length !== 0 &&
                    messages.map((message, i) => (
                        <li key={i} style={{ color: "wheat" }}>{message.message}</li>
                    ))
                }
            </ul>
            <MessageInput />
        </div>
    )
}

export default ChatSection
