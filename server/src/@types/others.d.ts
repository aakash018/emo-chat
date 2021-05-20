
declare interface IRefToken {
    userID: string
}

declare interface ISocketJoinPayload {
    id: string,
    userID: string,
    currentRoom: string | null
}

declare interface IJWT {
    user: IUser,
    iat: number,
    exp: number

}
