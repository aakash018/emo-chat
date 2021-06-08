import { useRoom } from "context/room"
import { useFetch } from "hooks/useFetch"
import { useEffect, useRef, useState } from "react"
import socket from "socket"
import MessageContainer from "./MessageContainer"
import MessageInput from "./MessageInput"
import style from "./style.module.scss"

interface Props {

}



const ChatSection: React.FC<Props> = ({ }) => {

    const { currentRoom } = useRoom()

    const [messages, setMessages] = useState<IMessage[]>([])
    const [loading, setLoading] = useState(false)

    const chatContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        socket.on("message", (data: IMessage) => {
            console.log(data)
            setMessages(prev => prev.concat(data))
            chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight)
        })
        socket.on("unsend", (data) => {
            console.log(data)
            setMessages(prev => prev.filter(message => message.id !== data.messageID))
        })

        return () => {
            socket.disconnect()
        }

    }, [])

    useEffect(() => {
        (async () => {
            if (currentRoom) {
                setLoading(true)
                const res = await useFetch
                    <{ ok: boolean, messages: Array<IMessage> }>
                    (
                        "GET",
                        "api/room/messages",
                        { roomID: currentRoom }
                    )

                setLoading(false)
                setMessages(res!.data.messages)
                chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight)

            }
        }
        )()
    }, [currentRoom])

    if (loading) {
        return (
            <div className={style.chat_section}>
                <h2>Loading</h2>
            </div>
        )
    }

    return (
        <div className={style.chat_section}>
            {currentRoom &&
                <>
                    <div className={style.chat_messages} ref={chatContainer}>
                        {messages.length !== 0 &&
                            messages.map((message, i) => (
                                <MessageContainer key={i}
                                    id={message.user.id}
                                    flag={message.flag}
                                    messageID={message.id}
                                    writerName={message.user.firstName}
                                    writenDate={message.createdAt}
                                    profilePic={message.user.picture}
                                >{`${message.message}`}</MessageContainer>
                            ))
                        }
                    </div>
                    <MessageInput />
                </>
            }
        </div>
    )
}

export default ChatSection
