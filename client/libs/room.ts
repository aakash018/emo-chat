let roomID: string | null = null;

export const getCurrentRoom = () => {
    return roomID
}

export const setCurrentRoom = (id: string) => {
    roomID = id
}