
import express from "express"
import cors from 'cors'
import http from 'http'
import passport from "passport"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import "./config/passport"
import "reflect-metadata"
// import * as dotenv from "dotenv"

// dotenv.config()

// Route
import auth from './api/auth'
import room from "./api/room"


import { createConnection } from "typeorm"
import { User } from "./entities/Users"
import { Room } from "./entities/Rooms"
import { Message } from "./entities/message"
import { Joined } from "./entities/Joined"


const app = express()
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_END_POINT,
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
        entities: [User, Room, Message, Joined],
        synchronize: true,
        logging: true,

    }).then(async (_) => {
        console.log("Connected To PSQL")
        // await Joined.delete({})
        // await Message.delete({})
        // await Room.delete({})
        // await User.delete({})



        const room = await _.getRepository(Room).findOne({ relations: ["messages"], where: { id: "a65db84a-f9a4-48cb-af86-255ab242fc9a" } })

        console.log(room?.messages)
    }).catch(error => console.log(error));
})();


// Parser MiddleWare
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


// SocketsINIT
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_END_POINT,
        methods: ["GET", "POST"]
    }
})

// Sockets
io.on("connection", (socket) => {
    console.log("user connected")

    socket.on("message", async (msg) => {
        io.to(msg.roomID).emit("message",
            { writtenBy: msg.username, message: msg.message }
        )
        //? Save Messages
        await Message.create({
            message: msg.message,
            writtenBy: msg.username,
            roomID: msg.roomID
        }).save()

    })

    socket.on("join", (data: ISocketJoinPayload) => {
        console.log("ram")
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