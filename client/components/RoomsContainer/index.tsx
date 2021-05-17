import axios from 'axios'
import { useUser } from 'context/user'
import React, { useEffect, useRef, useState } from 'react'
import socket from 'socket'
import style from './style.module.scss'
const RoomContainer = () => {

    const name = useRef<HTMLInputElement>(null)
    const { currentUser } = useUser()
    const [rooms, setRooms] = useState<Array<IRoom>>()
    const addServer = async () => {
        const res = axios
            .post("http://localhost:5000/api/room/add",
                { creator: currentUser?.displayName, serverName: name.current?.value }
            )
        console.log((await res).data)
    }

    useEffect(() => {
        (
            async () => {
                const res = await axios.get("http://localhost:5000/api/room/getRooms")
                setRooms(res.data)
            }
        )()
    }, [])


    const joinServer = (id: string) => {
        socket.emit("join", { userID: currentUser?.id, id: id })
    }

    return (
        <div className={style.rooms}>
            <div className="makeRoom">
                <input type="text" ref={name} />
                <button onClick={addServer} >Add</button>
            </div>
            <div className="listRooms">
                {
                    rooms?.map(room => (
                        <button key={room.id} onClick={() => joinServer(room.id)}>{room.name}</button>
                    ))
                }
            </div>
        </div>
    )
}

export default RoomContainer
