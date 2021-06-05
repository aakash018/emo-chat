import axios from 'axios'
import ToggleSlider from 'components/ToggleSlider'
import { useRoom } from 'context/room'
import { useUser } from 'context/user'
import { AlertContext } from 'pages/_app'
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { FaDoorOpen, FaSearch, FaArrowRight } from 'react-icons/fa'
import socket from 'socket'
import style from './style.module.scss'
const RoomContainer = () => {

    const name = useRef<HTMLInputElement>(null)
    const { currentUser } = useUser()
    const { currentRoom, setCurrentRoom } = useRoom()
    const { setAlert } = useContext(AlertContext)
    const [roomsList, setRoomsList] = useState<IRoom[]>([])
    const [showRoomForMobile, setShowRoom] = useState(false)
    const searchInput = useRef<HTMLInputElement>(null)


    useEffect(() => {
        (
            async () => {

                try {
                    if (setAlert) {
                        setAlert({
                            message: ""
                        })
                    }
                    const res = await axios.get(`http://localhost:5000/api/room/getRooms`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    if (!res.data.ok) {
                        if (setAlert) {
                            setAlert({
                                type: "error",
                                message: "Error Getting Rooms"
                            })
                        }
                        return
                    }
                    if (setRoomsList) {
                        setRoomsList(res.data.rooms)
                    }
                } catch (e) {
                    console.error(e)
                    if (setAlert) {
                        setAlert({
                            type: "error",
                            message: "Server Error"
                        })
                    }
                }
            }
        )()
    }, [])


    useEffect(() => {
        socket.on("user-left-room", (data: { ok: boolean, roomID: string }) => {
            setRoomsList(prev => prev.filter(room => room.id !== data.roomID))
        })
    }, [])

    const addRoom = async () => {

        if (name.current?.value.trim() === "") {
            return
        }

        try {
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

            if (!res.data.ok) {
                if (setAlert) {
                    setAlert({
                        type: "error",
                        message: "Failed to add room"
                    })
                }
                return
            }

            if (res.data.ok) {
                if (setRoomsList) {
                    setRoomsList(prev => prev!.concat(res.data.room))
                }
            }

        } catch (e) {
            console.error(e)
            if (setAlert) {
                setAlert({
                    type: "error",
                    message: "Failed to add room"
                })
            }
        }

    }


    const connectToRoom = async (id: string) => {
        const payload = {
            userID: currentUser?.id,
            id: id,
            currentRoom: currentRoom,
            displayName: currentUser?.displayName,
            picture: currentUser?.picture
        }
        socket.emit("join", payload)

        const res = await axios.post("http://localhost:5000/api/room/joinRoom", { roomID: id }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        console.log(res.data)
        if (setCurrentRoom) {
            setCurrentRoom(id)
        }
        setShowRoom(false)
        if (setAlert) {
            setAlert({
                type: "message",
                message: "Connected"
            })
        }

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
        <div className={`${style.rooms} ${showRoomForMobile ? style.active : ""}`}>
            <ToggleSlider toggle={showRoomForMobile} toggleSetState={setShowRoom} />
            <div className={style.searchRooms}>
                <form onSubmit={handleSerach}>
                    <input type="text" placeholder="Search by Name" ref={searchInput} />
                    <button type="submit"><FaSearch /></button>
                </form>
            </div>

            <div className={style.listRooms}>
                {
                    roomsList?.map(room => (
                        <button key={room.id} onClick={() => connectToRoom(room.id)}
                            className={room.id === currentRoom ? `${style.connected}` : ""}>
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
