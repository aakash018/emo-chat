
import express from "express"
import cors from 'cors'
import http from 'http'
import passport from "passport"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import "./config/passport"
import "reflect-metadata"
import dotenv from "dotenv"

dotenv.config()
//*Route
import auth from './api/auth'
import room from "./api/room"


import { createConnection } from "typeorm"
import { User } from "./entities/Users"
import { Room } from "./entities/Rooms"






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
        entities: [User, Room],
        synchronize: true,
        logging: true,
    }).then(_ => {
        console.log("Connected To PSQL")
    }).catch(error => console.log(error));
})();


//*Parser MiddleWare
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


//sockets
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("user connected")

    socket.on("message", (msg) => {
        console.log(msg)
        io.to(msg.roomID).emit("message",
            { username: msg.username, message: msg.message, sendAt: msg.sendAt }
        )
    })

    socket.on("join", (data) => {
        socket.join(data.id);
        socket.join(data.userID)
        io.to(data.userID).emit("joined", { ok: true, id: data.id })
    })
})



//*Passport
app.use(passport.initialize())



//*Routes
app.use("/auth", auth)
app.use("/api/room", room)



app.get("/", (_, res) => {
    res.send(`Server running at: ${PORT}`)
})


server.listen(PORT, () => {
    console.log("Server at PORT:", PORT)
})