declare interface IRefToken {
    userID: string
}

declare interface ISocketJoinPayload {
    id: string,
    userID: string,
    currentRoom: string | null
}