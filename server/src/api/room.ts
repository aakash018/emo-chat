import express from "express"
import { Room } from "../entities/Rooms";
import { getConnection } from "typeorm";


const route = express()

route.post("/add", async (req, res) => {
    const { creator, serverName }: { creator: string, serverName: string } = req.body
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

route.get("/getRooms", async (_, res) => {
    const rooms = await Room.find()
    res.json(rooms)
})


export default route