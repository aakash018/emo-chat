
let _CurrentroomID: string | null = null;
export const getCurrentRoom = () => {
    return _CurrentroomID
}

export const setCurrentRoom = (id: string) => {
    _CurrentroomID = id
}