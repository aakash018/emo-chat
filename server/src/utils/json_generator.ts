import jwt from "jsonwebtoken"


export const createToken = (userInfo: any, expTime: string | number = "15m") => {
    return jwt.sign({ user: userInfo }, "fsdfsdfsdfsdfsdf", { expiresIn: expTime })
}

export const createRefToken = (data: string | object, expTime: string | number = "7d") => {
    return jwt.sign(data, "dfdxcvsdfedfd", { expiresIn: expTime })
}