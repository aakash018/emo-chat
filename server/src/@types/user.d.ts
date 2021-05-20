declare interface IUser {
    id: string,
    firstName: string,
    secondName: string,
    email: string,
    displayName: string,
    picture: string,
    createdAt: number,
    updatedAt: number
}


declare namespace Express {
    export interface Request {
        user?: IUser
    }
}