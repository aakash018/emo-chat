import MainButton from 'components/MainButton'
import { useUser } from 'context/user'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import socket from 'socket'
import style from "./style.module.scss"
const ChatContainer = () => {

    const messageInput = useRef<HTMLInputElement>(null)
    const { currentUser } = useUser()
    const roomID = useRef(null)


    useEffect(() => {
        socket.on("message", (m) => {
            console.log(m)
            // setMessageList(prev => prev.concat(m))
        })

        socket.on("dis", (m) => {
            console.log(m)
        })
        socket.on("con", (m) => {
            console.log(m)
        })
        socket.on("joined", (m) => {
            console.log(m)
            roomID.current = m.id
        })
        return () => {
            socket.disconnect()
        }
    }, [])



    const handleSend = (e: FormEvent) => {
        e.preventDefault()
        const info = {
            username: currentUser?.firstName,
            roomID: roomID.current,
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
