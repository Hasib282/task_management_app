import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskEntity } from "./task.entity";
import { UserEntity } from "./user.entity";

@Entity('Team')
export class TeamEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    team_name: string;

    @ManyToOne(() => UserEntity, (user) => user.teamsCreated)
    createdBy: UserEntity;

    @ManyToMany(() => UserEntity, (user) => user.teams)
    @JoinTable()
    members: UserEntity[];

    @OneToMany(() => TaskEntity, (task) => task.team)
    tasks: TaskEntity[];
}