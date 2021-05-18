import MainButton from 'components/MainButton'
import { useUser } from 'context/user'
import { getCurrentRoom, setCurrentRoom } from 'libs/room'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import socket from 'socket'
import style from "./style.module.scss"

interface ISocketJoined {
    ok: boolean,
    id: string
}

interface ISocketMessage {
    username: string,
    message: string
}


const ChatContainer = () => {

    const messageInput = useRef<HTMLInputElement>(null)
    const { currentUser } = useUser()


    useEffect(() => {
        socket.on("message", (data: ISocketMessage) => {
            console.log(data)
        })

        socket.on("joined", (data: ISocketJoined) => {
            console.log(data)
            setCurrentRoom(data.id)
        })
        return () => {
            socket.disconnect()
        }
    }, [])



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
        <div className={style.chat} style={{ position: "relative" }}>
            <form onSubmit={handleSend} style={{ position: "absolute", bottom: "0" }}>
                <input type="text" ref={messageInput} />
                <MainButton type="submit" >Send</MainButton>
            </form>
        </div>
    )
}

export default ChatContainer
