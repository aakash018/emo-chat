import { useRoom } from "context/room"
import { useUser } from "context/user"
import { FlagsStyle } from "libs/flags"
import Image from "next/image"
import { useState } from "react"
import socket from "socket"
import style from "./message.module.scss"

interface Props {
    id: string,
    writerName: string,
    writenDate: number,
    profilePic: string,
    messageID: string,
    flag?: string
}

const MessageContainer: React.FC<Props> = ({
    children,
    writerName,
    writenDate,
    profilePic,
    id,
    messageID,
    flag }) => {

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
                <div className={style.messageContaienr} style={flag ? FlagsStyle[flag] : {}}>
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
                    {flag &&
                        <div className={style.flagPic}>
                            <Image src={`/assets/flags/${flag}.svg`} width="80px" height="80px" />
                        </div>
                    }
                    {currentUser?.id === id && isHovering &&
                        <div className={style.options}>
                            <button onClick={handleUnsend}>x</button>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default MessageContainer
