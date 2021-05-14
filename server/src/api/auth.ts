import express from "express"
import passport from "passport";
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
        // successRedirect: 'http://localhost:3000/auth/jhsdffuhdu?ref=dkhfajshdfjhfjh',
        failureRedirect: '/auth/google/failure',
        session: false,
    }), (req, res) => {
        res.set("dsfsdf-sfsdf", "sdfsdfsdfsdf")
        res.json(req.user)
        // res.redirect("http://localhost:3000/auth/sdadad?ref=ffdfs")
    });

route.get("/google/failure", (_, res) => {
    return res.send("Failed")
})


export default route