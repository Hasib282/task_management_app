import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './Entity/task.entity';
import { TeamEntity } from './Entity/team.entity';
import { UserEntity } from './Entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, TeamEntity, TaskEntity])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
