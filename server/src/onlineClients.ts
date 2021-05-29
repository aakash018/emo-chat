interface IOnlineClients {
    roomID: string,
    onlineClients: {
        userID: string,
        displayName: string,
        profilePic: string
    }[]
}

let OnlineClients: IOnlineClients[] = []

export const getOnlineClients = (roomID: string) => {
    const OnlineRoomData = OnlineClients.filter(client => client.roomID === roomID)

    return OnlineRoomData[0].onlineClients
}

export const pushOnlineClient = (roomID: string,
    userID: string,
    displayName: string,
    profilePic: string) => {

    if (OnlineClients.some(clients => clients.roomID === roomID)) {
        OnlineClients.forEach(clients => {
            if (clients.roomID === roomID) {
                clients.onlineClients.push({
                    displayName,
                    profilePic,
                    userID
                })
                return
            }
        })
    } else {
        OnlineClients.push({
            roomID,
            onlineClients: [
                {
                    displayName,
                    profilePic,
                    userID
                }
            ]
        })
    }

}

export const removeUser = (roomID: string, userID: string) => {
    console.log(roomID, userID, "Hello")

    console.log("CL", OnlineClients[0].onlineClients)

}