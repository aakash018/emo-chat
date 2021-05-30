const ListOfOnlineClients: string[] = []

export const getOnlineClients = () => {
    return ListOfOnlineClients
}

export const addOnlienClients = (userID: string) => {
    ListOfOnlineClients.push(userID)
}

export const removeOnlineClient = (userID: string) => {
    ListOfOnlineClients.splice(ListOfOnlineClients.indexOf(userID), 1)
}