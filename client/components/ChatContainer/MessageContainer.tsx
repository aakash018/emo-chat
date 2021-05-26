import { useRoom } from "context/room"
import { useUser } from "context/user"
import Image from "next/image"
import { useState } from "react"
import socket from "socket"
import style from "./message.module.scss"

interface Props {
    id: string,
    writerName: string,
    writenDate: number,
    profilePic: string,
    messageID: string
}

const MessageContainer: React.FC<Props> = ({
    children,
    writerName,
    writenDate,
    profilePic,
    id,
    messageID }) => {

    const { currentUser } = useUser()
    const { currentRoom } = useRoom()

    const [isHovering, setHovering] = useState(false)

    const handleUnsend = () => {
        socket.emit("unsend", {
            messageID: messageID,
            roomID: currentRoom
        })
    }

    return (
        <>
            <div className={style.messageWraper}
                onMouseEnter={
                    () => setHovering(true)
                }
                onMouseLeave={
                    () => setHovering(false)
                }
            >
                <div className={style.messageContaienr}>
                    <div className={style.userInfo} >
                        <div className={style.profilePic} >
                            <Image src={profilePic} width="100%" height="100%" alt="profile-pic" />
                        </div>
                        <div className={style.textStuff} >
                            <span className={style.displayName} >{writerName}</span>
                            <span className={style.messageTime} >{new Date(writenDate).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className={style.message}>
                        {children}
                    </div>
                </div>
                <div className={style.options}>
                    {currentUser?.id === id && isHovering &&
                        <button onClick={handleUnsend}>Unsend</button>
                    }
                </div>
            </div>
        </>
    )
}

export default MessageContainer
