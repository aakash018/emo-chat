import express from "express"
import { Room } from "../entities/Rooms";
import { getConnection } from "typeorm";
import { validateUser } from "../utils/verifyUser";

import { Joined } from "../entities/Joined";
import { User } from "../entities/Users";


const route = express()

route.post("/add", validateUser, async (req, res) => {
    const { serverName }: { serverName: string } = req.body
    const creator = req.user?.displayName
    try {
        const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Room)
            .values(
                {
                    name: serverName,
                    owner: creator,
                }
            )
            .execute();
        const newRoom = await Room.findOne({ id: result.identifiers[0].id })
        await Joined.create({
            roomID: newRoom?.id,
            userID: req.user?.id
        }).save()
        res.json({
            ok: true,
            room: newRoom
        })

    } catch (e) {
        console.log(e)
        res.send({
            ok: false,
            message: "Unknown server error"
        })
    }
})

route.post("/joinRoom", validateUser, async (req, res) => {
    const { roomID }: { roomID: string } = req.body

    const joinedRooms = await getConnection()
        .getRepository(User)
        .findOne({ id: req.user?.id }, { relations: ["rooms"] })

    //* Only join room if hasn't joined yet
    if (joinedRooms?.rooms.every(room => room.roomID !== roomID)) {
        try {
            await Joined.create({
                roomID,
                userID: req.user?.id
            }).save()
        } catch (e) {
            console.log(e)
            res.json({
                ok: false,
                message: "Error while saving"
            })
        }
    } else {
        res.json({
            ok: false,
            message: "room alreaddy joined"
        })
    }
})

route.get("/search", validateUser, async (req, res) => {
    const { searchQuery } = req.query
    try {
        const rooms = await getConnection()
            .getRepository(Room)
            .createQueryBuilder("room")
            .where("room.name LIKE :name", { name: `%${searchQuery}%` })
            .getMany()

        res.json({
            ok: true,
            rooms
        })

    } catch (e) {
        console.log(e)
        res.json({
            ok: false,
            message: "server error"
        })
    }
})

route.get("/getRooms", validateUser, async (req, res) => {
    try {
        const allRooms = await getConnection().getRepository(Room).find({ relations: ["users"] })

        //?Rooms joind by user
        const rooms = allRooms.filter(
            room => room.users.some(
                user => user.userID === req.user?.id
            )
        )
        res.json({
            ok: true,
            rooms
        })
    } catch (e) {
        console.log(e)
        res.json({
            ok: false,
            message: "Error saving"
        })
    }

})

route.get("/messages", validateUser, async (req, res) => {
    const { roomID } = req.query as { roomID: string }
    console.log(roomID)
    const roomCurrent = await getConnection().getRepository(Room).findOne({ relations: ["messages"], where: { id: roomID } })
    console.log(roomCurrent)
    res.json({
        ok: true,
        messages: roomCurrent?.messages
    })

})


export default route