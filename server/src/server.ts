// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// })

import express from "express"
import cors from 'cors'
import http from 'http'
import passport from "passport"
import cookieParser from "cookie-parser"
import "./config/passport"
import "reflect-metadata"

//*Route
import auth from './api/auth'
import { createConnection } from "typeorm"
import { User } from "./entities/Users"


const app = express()
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;



//* DataBase
(async () => {
    await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Thisisme@123",
        database: "emochat",
        entities: [User],
        synchronize: true,
        logging: false,
    }).then(_ => {
        console.log("Connected To PSQL")
    }).catch(error => console.log(error));
})();


//*Parser MiddleWare
app.use(express.json())
app.use(express.urlencoded({ extended: false }));





//*Passport
app.use(passport.initialize())



//*Routes
app.use("/auth", auth)



app.get("/", (_, res) => {
    res.send(`Server running at: ${PORT}`)
})


server.listen(PORT, () => {
    console.log("Server at PORT:", PORT)
})