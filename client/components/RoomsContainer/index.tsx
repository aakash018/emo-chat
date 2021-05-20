import axios from 'axios'
import { useUser } from 'context/user'
import { getCurrentRoom } from 'libs/room'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { FaDoorOpen, FaSearch } from 'react-icons/fa'
import socket from 'socket'
import style from './style.module.scss'
const RoomContainer = () => {

    const name = useRef<HTMLInputElement>(null)
    const { currentUser } = useUser()
    const [roomsList, setRoomsList] = useState<IRoom[]>([])
    const searchInput = useRef<HTMLInputElement>(null)


    useEffect(() => {
        (
            async () => {

                try {
                    const res = await axios.get(`http://localhost:5000/api/room/getRooms`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    if (!res.data.ok) {
                        return
                    }
                    if (setRoomsList) {
                        console.log
                        setRoomsList(res.data.rooms)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        )()
    }, [])

    const addRoom = async () => {

        if (name.current?.value.trim() === "") {
            return
        }

        const payload = {
            creator: currentUser?.displayName,
            serverName: name.current?.value,
        }

        const res = await axios
            .post("http://localhost:5000/api/room/add",
                payload, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }
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

        const res = await axios.post("http://localhost:5000/api/room/joinRoom", { roomID: id }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        console.log(res.data)

    }

    const handleSerach = async (e: FormEvent) => {
        e.preventDefault()
        if (searchInput.current?.value.trim() === "") {
            return
        }

        const res = await axios.get<{ ok: boolean, rooms: IRoom[] }>("http://localhost:5000/api/room/search", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            params: {
                searchQuery: searchInput.current?.value
            }
        }
        )
        if (res.data.ok) {
            setRoomsList(res.data.rooms)
        }
    }

    return (
        <div className={style.rooms}>
            <div className={style.searchRooms}>
                <form onSubmit={handleSerach}>
                    <input type="text" placeholder="Search by Id" ref={searchInput} />
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
                <button onClick={addRoom} ><FaDoorOpen /></button>
            </div>
        </div>
    )
}

export default RoomContainer
