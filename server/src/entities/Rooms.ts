import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Joined } from "./Joined";
import { Message } from "./message";


@Entity()
export class Room extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string

    @Column()
    owner: string;

    @OneToMany(() => Message, message => message.room)
    messages: Message[];

    @OneToMany(() => Joined, joined => joined.users)
    users: Joined[]

    // @ManyToMany(() => User, user => user.rooms)
    // @JoinTable({ name: "userID" })
    // users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}