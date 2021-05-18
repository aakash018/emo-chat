import axios from 'axios'
import { useRoom } from 'context/room'
import { useUser } from 'context/user'
import { getCurrentRoom } from 'libs/room'
import React, { useEffect, useRef } from 'react'
import { FaDoorOpen, FaSearch } from 'react-icons/fa'
import socket from 'socket'
import style from './style.module.scss'
const RoomContainer = () => {

    const name = useRef<HTMLInputElement>(null)
    const { currentUser } = useUser()
    const { roomsList, setRoomsList } = useRoom()


    useEffect(() => {
        (
            async () => {
                try {
                    const res = await axios.get("http://localhost:5000/api/room/getRooms")
                    if (setRoomsList) {
                        setRoomsList(res.data)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        )()
    }, [])

    const addServer = async () => {

        if (name.current?.value.trim() === "") {
            return
        }

        const res = await axios
            .post("http://localhost:5000/api/room/add",
                { creator: currentUser?.displayName, serverName: name.current?.value }
            )
        console.log(res.data)
        if (res.data.ok) {
            if (setRoomsList) {
                setRoomsList(prev => prev!.concat(res.data.room))
            }
        }
    }


    const joinServer = async (id: string) => {

        const payload = {
            userID: currentUser?.id,
            id: id,
            currentRoom: getCurrentRoom()
        }
        socket.emit("join", payload)
    }

    return (
        <div className={style.rooms}>

            <div className={style.searchRooms}>
                <form>
                    <input type="text" placeholder="Search by Id" />
                    <button type="submit"><FaSearch /></button>
                </form>
            </div>

            <div className={style.listRooms}>
                {
                    roomsList?.map(room => (
                        <button key={room.id} onClick={() => joinServer(room.id)}>
                            <section className={style.profilePic}></section>
                            <section className={style.roomInfo} >
                                <span>{room.name}</span>
                                <span className={style.ownerName}>{room.owner}</span>
                            </section>
                        </button>
                    ))
                }
            </div>
            <div className={style.makeRoom}>
                <input type="text" ref={name} placeholder="Create New Room" />
                <button onClick={addServer} ><FaDoorOpen /></button>
            </div>
        </div>
    )
}

export default RoomContainer
