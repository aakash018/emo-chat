import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Room } from "./Rooms";

@Entity()
export class Message extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    writtenBy: string

    @Column()
    message: string

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