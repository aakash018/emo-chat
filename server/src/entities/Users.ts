import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Joined } from "./Joined";
import { Message } from "./message";
// import { Room } from "./Rooms";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    displayName: string

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    picture: string;


    @OneToMany(() => Joined, joined => joined.rooms)
    rooms: Joined[]

    @OneToMany(() => Message, message => message.user)
    messages: Message[]


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}