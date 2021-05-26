declare interface IMessage {
    message: string,
    createdAt: number,
    id: string,
    user: {
        id: string,
        firstName: string,
        picture: string
    }
}