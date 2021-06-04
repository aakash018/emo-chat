import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Room } from "./Rooms";
import { User } from "./Users";

@Entity()
export class Message extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    message: string

    @Column({ nullable: true })
    flag: string

    @Column()
    userID: string
    @ManyToOne(() => User, user => user)
    @JoinColumn({ name: "userID" })
    user: User

    @Column()
    roomID: string;
    @ManyToOne(() => Room, room => room.messages)
    @JoinColumn({ name: "roomID" })
    room: Room;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}