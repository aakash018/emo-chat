import React, { useContext, useState } from 'react'


interface IRoomData {
    roomsList: Array<IRoom> | null,
    setRoomsList: React.Dispatch<React.SetStateAction<Array<IRoom> | null>> | null
}

const RoomContext = React.createContext<IRoomData>({
    roomsList: null,
    setRoomsList: null
})
export const useRoom = () => {
    return useContext(RoomContext)
}

const RoomProvider: React.FC = ({ children }) => {

    const [roomsList, setRoomsList] = useState<Array<IRoom> | null>(null)


    const value = {
        roomsList,
        setRoomsList
    }

    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    )
}

export default RoomProvider
