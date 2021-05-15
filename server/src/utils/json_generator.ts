import jwt from "jsonwebtoken"


export const createToken = (userInfo: any, expTime: string | number = "15m") => {
    return jwt.sign({ user: userInfo }, process.env.JWT_TOKEN, { expiresIn: expTime })
}

export const createRefToken = (data: string | object, expTime: string | number = "7d") => {
    return jwt.sign(data, process.env.REF_JWT_TOKEN, { expiresIn: expTime })
}