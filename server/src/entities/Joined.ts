import { Entity, BaseEntity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Room } from "./Rooms";
import { User } from "./Users";

@Entity()
export class Joined extends BaseEntity {

    @PrimaryColumn()
    roomID: string
    @ManyToOne(() => Room, room => room.users)
    @JoinColumn({ name: "roomID" })
    users: User[]

    @PrimaryColumn()
    userID: string
    @ManyToOne(() => User, user => user.rooms)
    @JoinColumn({ name: "userID" })
    rooms: Room[]

}