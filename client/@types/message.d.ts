declare interface IMessage {
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