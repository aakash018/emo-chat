import React, { useContext, useState } from 'react'


interface IRoomData {
    currentRoom: string | null,
    setCurrentRoom: React.Dispatch<React.SetStateAction<string | null>> | null
}

const RoomContext = React.createContext<IRoomData>({
    currentRoom: null,
    setCurrentRoom: null
})
export const useRoom = () => {
    return useContext(RoomContext)
}

const RoomProvider: React.FC = ({ children }) => {

    const [currentRoom, setCurrentRoom] = useState<string | null>(null)


    const value = {
        currentRoom: currentRoom,
        setCurrentRoom: setCurrentRoom
    }

    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    )
}

export default RoomProvider
