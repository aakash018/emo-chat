import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
export const validateUser: RequestHandler = (req, res, next) => {

    const token = req.header("Authorization")?.split(" ")[1]

    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_TOKEN) as { user: IUser }
            //* If token is validated payload has user info
            if (payload) {
                req.user = payload.user
                next()
            } else {
                return res.json({
                    ok: false,
                    message: "Error verifying token"
                })
            }
        } catch {
            return res.json({
                ok: false,
                message: "invalid token"
            })
        }

    } else {
        return res.json({
            ok: false,
            message: "No Token Found"
        })
    }
}