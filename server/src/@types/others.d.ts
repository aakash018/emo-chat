
declare interface IRefToken {
    userID: string
}

declare interface ISocketJoinPayload {
    id: string,
    userID: string,
    currentRoom: string | null, //* @param ("If any rooom was joined")
    displayName: string,
    picture: string
}

declare interface IJWT {
    user: IUser,
    iat: number,
    exp: number

}

declare interface ISocketMessagePayload {
    displayName: string,
    roomID: string,
    message: string,
    profilePic: string
}

declare interface IMessagePayload {
    message: string,
    createdAt: number,
    id: string,
    flag?: string,
    user: {
        id: string,
        firstName: string,
        picture: string
    }
}

declare interface IUnsendData {
    messageID: string,
    roomID: string
}