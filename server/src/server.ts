
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

// Route
import auth from './api/auth'
import room from "./api/room"


import { createConnection } from "typeorm"
import { User } from "./entities/Users"
import { Room } from "./entities/Rooms"
import { Message } from "./entities/message"


const app = express()
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;



// DataBase
(async () => {
    await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Thisisme@123",
        database: "emochat",
        entities: [User, Room, Message],
        synchronize: true,
        logging: true,
    }).then(async _ => {
        console.log("Connected To PSQL")
        // await Message.delete({})
        // await Room.delete({})

        // const room = await connection.getRepository(Room).find({ relations: ["messages"] })

        // console.log(room[0].messages)

    }).catch(error => console.log(error));
})();


// Parser MiddleWare
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


// SocketsINIT
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

// Sockets
io.on("connection", (socket) => {
    console.log("user connected")

    socket.on("message", async (msg) => {
        io.to(msg.roomID).emit("message",
            { username: msg.username, message: msg.message }
        )
        //? Save Messages
        await Message.create({
            message: msg.message,
            writtenBy: msg.username,
            roomID: msg.roomID
        }).save()

    })

    socket.on("join", (data: ISocketJoinPayload) => {
        socket.join(data.id);
        socket.join(data.userID)
        if (data.currentRoom) {
            socket.leave(data.currentRoom)
        }
        io.to(data.userID).emit("joined", { ok: true, id: data.id })
    })
})



//Passport
app.use(passport.initialize())



//Routes
app.use("/auth", auth)
app.use("/api/room", room)



app.get("/", (_, res) => {
    res.send(`Server running at: ${PORT}`)
})


server.listen(PORT, () => {
    console.log("Server at PORT:", PORT)
})