import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
export const validateUser: RequestHandler = (req, res, next) => {
    const { token } = req.body

    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_TOKEN)

            //* If token is validated payload has user info
            if (payload) {
                next()
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