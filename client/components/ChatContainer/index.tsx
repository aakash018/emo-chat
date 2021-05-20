import MainButton from 'components/MainButton'
import { useUser } from 'context/user'
import { getCurrentRoom, setCurrentRoom } from 'libs/room'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import socket from 'socket'
import ChatSection from './ChatSection'
import style from "./style.module.scss"

interface ISocketJoined {
    ok: boolean,
    id: string
}



const ChatContainer = () => {

    useEffect(() => {
        socket.on("joined", (data: ISocketJoined) => {
            console.log(data)
            setCurrentRoom(data.id)
        })
        return () => {
            socket.disconnect()
        }
    }, [])



    return (
        <div className={style.chat} style={{ position: "relative" }}>
            <ChatSection />
        </div>
    )
}

export default ChatContainer
