declare interface IRoom {
    name: string,
    id: string,
    createdAt: number,
    updatedAt: number,
    owner: string
}

declare interface IRoomUsers {
    userID: string,
    roomID: string,
    rooms: {
        displayName: string,
        picture: string
    }
}