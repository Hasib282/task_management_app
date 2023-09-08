import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskEntity } from "./task.entity";
import { TeamEntity } from "./team.entity";

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    profilepic: string;

    @Column({ nullable: true })
    bio: string;

    @OneToMany(() => TeamEntity, (team) => team.createdBy)
    teamsCreated: TeamEntity[];

    @OneToMany(() => TeamEntity, (team) => team.members)
    teams: TeamEntity[];

    @OneToMany(() => TaskEntity, (task) => task.assignedTo)
    tasks: TaskEntity[];
}