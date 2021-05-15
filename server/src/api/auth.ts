import express from "express"
import jwt from "jsonwebtoken";
import passport from "passport";
import { validateUser } from "../utils/verifyUser";
import { User } from "../entities/Users";
import { createRefToken, createToken } from "../utils/json_generator";
// import { User } from "src/entities/Users";


const route = express()

route.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

route.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure',
        session: false,
    }), async (req, res) => {
        if (req.user) {
            const currentUser = await User.findOne({ where: { email: (req.user as any).email } })
            // console.log(currentUser)
            res.clearCookie("ref")
            res.cookie("ref", createRefToken({ userID: currentUser?.id }), {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            })
            res.redirect("http://localhost:3000/dash")
        }

    });

route.get("/google/failure", (_, res) => {
    return res.send("Failed")
})


route.get('/getToken', async (req, res) => {
    const token = req.cookies.ref
    if (!token) {
        return res.json({ ok: false, message: "No Token Found" })
    }

    try {
        const payload = jwt.verify(token, process.env.REF_JWT_TOKEN) as IRefToken //? Ref Token
        if (payload) {
            const user = await User.findOne({ where: { id: payload.userID } })
            if (user) {
                return res.json({
                    ok: true,
                    token: createToken(user)
                })
            }
        } else {
            return res.json({ ok: false, message: "Error validating token" })
        }
    } catch (e) {
        return res.json({ ok: false, message: "Unknown error !!" })
    }
})




//! TEST

route.post("/test", validateUser, (_, res) => {
    return res.send("Ok! You get a pass")
})


export default route