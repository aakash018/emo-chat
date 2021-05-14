import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}