import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO, UserLoginDTO, UserUpdateDTO, UserUpdatePassDTO } from './DTO/User.DTO';
import { TaskEntity } from './Entity/task.entity';
import { TeamEntity } from './Entity/team.entity';
import { UserEntity } from './Entity/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(TeamEntity) private teamRepo: Repository<TeamEntity>,
        @InjectRepository(TaskEntity) private taskRequestRepo: Repository<TaskEntity>,
    ) { }

    //////////////////////////////////////////// User registration part start Here /////////////////////////////////////
    getHello(): string {
        return 'Hello World!';
    }

    //User Registration
    async userRegistration(data: UserDTO) {
        //hasshing the password
        const pass = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, pass);

        return await this.userRepo.save(data);
    }

    //check Email
    async checkEmail(email) {
        return this.userRepo.findOneBy({ email: email })
    }

    //check username
    async checkUsername(username) {
        return this.userRepo.findOneBy({ username: username })
    }



    //////////////////////////////////////////// User registration part end Here ///////////////////////////////////////


    //////////////////////////////////////////// User login part start Here ///////////////////////////////////////

    //User Login
    async userLogin(data: UserLoginDTO) {
        const profile = await this.getUser(data.username);
        const isMatch: boolean = await bcrypt.compare(data.password, profile.password);
        if (isMatch) {
            return isMatch;
        }
        else {
            return false;
        }
    }


    //////////////////////////////////////////// User login part end Here ///////////////////////////////////////



    //////////////////////////////////////////// get user part start Here ///////////////////////////////////////

    //Show all User
    async getAllUser() {
        return this.userRepo.find();
    }


    //Show User Profile by email
    async getUser(username) {
        return this.userRepo.findOneBy({ username: username });
    }


    //Show User by id
    async getUserById(id) {
        return this.userRepo.findOneBy({ id: id });
    }

    //////////////////////////////////////////// get user part end Here ///////////////////////////////////////



    ////////////////////////////////////////// user update, delete part start Here ///////////////////////////////////////

    //update mechanic Profile picture
    async updateProfilePicture(username, profile: Express.Multer.File): Promise<string> {
        console.log(username);
        const user = await this.userRepo.findOne({ where: { username: username } });
        const data = profile.filename;
        const update = await this.userRepo.update(user.id, { profilepic: data });
        console.log(update);
        return data;
    }



    //Update User Profile
    async updateUser(id, data: UserUpdateDTO) {
        return this.userRepo.update(id, data);
    }


    //verify User password
    async verifyPassword(id, data: UserUpdatePassDTO): Promise<any> {
        const profile = await this.userRepo.findOneBy({ id });
        const isMatch: boolean = await bcrypt.compare(data.old_password, profile.password);
        if (isMatch) {
            return isMatch;
        }
        else {
            return false;
        }
    }


    //Update User password
    async changePassword(id, password): Promise<any> {
        const pass = await bcrypt.genSalt();
        password = await bcrypt.hash(password, pass);
        return this.userRepo.update(id, { password: password });
    }



    //Delete User Profile
    async deleteUser(id) {
        return this.userRepo.delete(id);
    }

    /////////////////////////////////////// user update, delete part end Here ///////////////////////////////////////


    //////////////////////////////////////////// Team crude part start Here /////////////////////////////////////

    





    //////////////////////////////////////////// Team crude part end Here ///////////////////////////////////////


    //////////////////////////////////////////// Task crude part start Here /////////////////////////////////////


    //////////////////////////////////////////// Task crude part end Here ///////////////////////////////////////

}
