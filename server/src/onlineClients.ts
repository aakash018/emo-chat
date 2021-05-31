interface IOnlineClients {
    socketID: string,
    userID: string
}

let ListOfOnlineClients: IOnlineClients[] = []

export const getOnlineClients = () => {
    return ListOfOnlineClients
}

export const addOnlienClients = (userID: string, socketID: string) => {
    ListOfOnlineClients.push({
        socketID,
        userID
    })
}

export const removeOnlineClient = (socketID: string) => {
    ListOfOnlineClients = ListOfOnlineClients.filter(clients => clients.socketID !== socketID)
}