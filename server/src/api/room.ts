import express from "express"
import { Room } from "../entities/Rooms";
import { getConnection } from "typeorm";


const route = express()

route.post("/add", async (req, res) => {
    const { creator, serverName }: { creator: string, serverName: string } = req.body
    try {
        await getConnection()
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
        res.send("Done")

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