
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
import { getOnlineClients, addOnlienClients } from "./onlineClients"



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
        logging: false,

    }).then(async (_) => {
        console.log("Connected To PSQL")
        // await Joined.delete({})
        // await Message.delete({})
        // await Room.delete({})
        // await User.delete({})



        // const messages = await _.getRepository(Message)
        //     .createQueryBuilder("message")
        //     .where("message.roomID = :id", { id: "44f41a79-e723-4ac7-84ae-402a94eddd6f" })
        //     .leftJoinAndSelect('message.user', 'user')
        //     .select(["message", "user.id", "user.displayName"])
        //     .getMany();

        // console.log(messages[0])
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

    socket.on("user-loged-on", (data: { userID: string }) => {
        addOnlienClients(data.userID)
    })

    socket.on("getOnlineClients", (data: { userID: string }) => {
        io.to(data.userID).emit("user-loged-in", { ok: true, clients: getOnlineClients() })
    })

    socket.on("message", async (msg:
        {
            message: string,
            roomID: string,
            userID: string,
            firstName: string,
            picture: string
        }
    ) => {
        //? Save Messages
        const newMessage = await Message.create({
            message: msg.message,
            roomID: msg.roomID,
            userID: msg.userID
        }).save()
        const payload: IMessagePayload = {
            message: msg.message,
            createdAt: Date.now(),
            id: newMessage.id,
            user: {
                id: msg.userID,
                firstName: msg.firstName,
                picture: msg.picture
            }
        }

        console.log(getOnlineClients())

        // console.log(msg)
        io.to(msg.roomID).emit("message",
            payload
        )
    })

    socket.on("join", async (data: ISocketJoinPayload) => {
        const user = await User.findOne({ where: { id: data.userID } })

        if (!user) {
            return io.to(data.userID).emit("joined", { ok: false, message: "User not found" })
        }

        socket.join(data.id);
        socket.join(data.userID)
        if (data.currentRoom) {
            socket.leave(data.currentRoom)
        }
        io.to(data.userID).emit("joined", { ok: true, id: data.id })
    })

    socket.on("unsend", async (data: IUnsendData) => {

        try {
            io.to(data.roomID).emit("unsend", { ok: true, messageID: data.messageID })
            await Message.delete({ id: data.messageID })

        } catch {
            io.to(data.roomID).emit("unsend", { ok: false, message: "failed to update message data" })
        }


    })

    socket.on("user-left-room", async (data: { userID: string, roomID: string }) => {

        await Joined.delete({
            userID: data.userID,
            roomID: data.roomID
        })

        io.to(data.userID).emit("user-left-room", { ok: true, roomID: data.roomID })

        socket.leave(data.roomID)

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