
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


import { createConnection, getConnection } from "typeorm"
import { User } from "./entities/Users"
import { Room } from "./entities/Rooms"
import { Message } from "./entities/message"
import { Joined } from "./entities/Joined"
import { getOnlineClients, addOnlienClients, removeOnlineClient } from "./onlineClients"



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



        // console.log(await Message.find({}))
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

    socket.on("disconnect", () => {
        removeOnlineClient(socket.id)
        socket.broadcast.emit("online-clients", { ok: true, clients: getOnlineClients() })

    })

    socket.on("user-loged-on", (data: { userID: string }) => {
        addOnlienClients(data.userID, socket.id)
        socket.broadcast.emit("online-clients", { ok: true, clients: getOnlineClients() })
    })


    //! Maybe USE HTTP for this --- REALLY BAD ---
    socket.on("getOnlineClients", (data: { userID: string }) => {
        io.to(data.userID).emit("online-clients", { ok: true, clients: getOnlineClients() })
    })

    socket.on("message", async (msg:
        {
            message: string,
            roomID: string,
            userID: string,
            firstName: string,
            picture: string,
            flag?: string
        }
    ) => {
        //? Save Messages
        const newMessage = await Message.create({
            flag: msg.flag,
            message: msg.message,
            roomID: msg.roomID,
            userID: msg.userID
        }).save()
        const payload: IMessagePayload = {
            message: msg.message,
            createdAt: Date.now(),
            id: newMessage.id,
            flag: msg.flag,
            user: {
                id: msg.userID,
                firstName: msg.firstName,
                picture: msg.picture
            }
        }

        // console.log(msg)
        io.to(msg.roomID).emit("message",
            payload
        )
    })

    socket.on("join", async (data: ISocketJoinPayload) => {
        socket.join(data.id);
        socket.join(data.userID)
        if (data.currentRoom) {
            socket.leave(data.currentRoom)
        }

        //? To Update room's users list

        const joinedRooms = await getConnection()
            .getRepository(User)
            .findOne({ id: data.userID }, { relations: ["rooms"] })

        if (joinedRooms?.rooms.every(room => room.roomID !== data.id)) {
            io.to(data.id).emit("a-user-joined", {
                ok: true, user: {
                    userID: data.userID,
                    rooms: {                                     //? Yeah its uhmmm....
                        displayName: data.displayName,
                        picture: data.picture
                    }
                }
            })
        }
        //? To say the client that they have joined
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
        io.to(data.roomID).emit("updateList", { ok: true, userID: data.userID })

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