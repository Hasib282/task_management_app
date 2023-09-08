import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "../../user/Entity/team.entity";
import { UserEntity } from "../../user/Entity/user.entity";

@Entity('Task')
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    due_date: Date;

    @Column()
    priority_level: string;

    @Column()
    status: string;

    @ManyToOne(() => UserEntity, (user) => user.tasks)
    assignedTo: UserEntity;

    @ManyToOne(() => TeamEntity, (team) => team.tasks)
    team: TeamEntity;
}