import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Req, Res, Session, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { UserDTO, UserLoginDTO, UserUpdateDTO, UserUpdatePassDTO } from './DTO/User.DTO';
import { SessionGuard } from './session.guard';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    /////////////////////////////////////// Registration part start here ////////////////////////////////////////////////////


    @Post('registration')
    @UseInterceptors(FileInterceptor('profile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg|JPG|WEBP|PNG|JPEG)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 1000000 },
            storage: diskStorage({
                destination: './profile',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UsePipes(new ValidationPipe)
    async userRegistration(@Body() data: UserDTO, @UploadedFile() profileobj: Express.Multer.File) {
        const email = await this.userService.checkEmail(data.email);
        const username = await this.userService.checkUsername(data.username);
        if (email != null) {
            throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
        }
        if (username != null) {
            throw new HttpException('Username already exist', HttpStatus.BAD_REQUEST);
        }
        if (!profileobj) {
            throw new HttpException('Please select your profile picture', HttpStatus.BAD_REQUEST);
        }
        else {
            data.profilepic = profileobj.filename;
            return this.userService.userRegistration(data);
        }


    }



    //////////////////////////////////////// registration part end here //////////////////////////////////////////////


    //////////////////////////////////////// login part start here ///////////////////////////////////////////////////



    @Post('login')
    @UsePipes(new ValidationPipe)
    async userLogin(@Session() session, @Body() data: UserLoginDTO) {
        try {
            const login = await this.userService.userLogin(data);
            if (login != true) {
                throw new HttpException('User doesnt exist. ', HttpStatus.NOT_FOUND);
            }
            else {
                session.username = data.username;
                console.log("Welcome " + session.username);
                return login;
            }
        }
        catch (error) {
            throw new HttpException('Username or Password is incorrect. ', HttpStatus.NOT_FOUND);
        }

    }


    ////////////////////////////////////// login part end here ///////////////////////////////////////////////////////


    ///////////////////////////////////// profile part start here ///////////////////////////////////////////////////

    //Show all usere
    @Get('users')
    async getAllUsers() {
        return this.userService.getAllUser();
    }

    @Get('user/:id')
    async getUserById(@Param('id', ParseIntPipe) id) {
        return this.userService.getUserById(id);
    }


    //show profile
    @Get('profile')
    @UseGuards(SessionGuard)
    async getProfile(@Session() session) {
        return this.userService.getUser(session.username);
    }


    //show profilepic by name
    @Get('profilepic/:name')
    async getImages(@Param('name') name, @Res() res): Promise<any> {
        res.sendFile(name, { root: './profile' })
    }



    //change profilepic
    @Put('changeprofile')
    @UseInterceptors(FileInterceptor('profile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 300000 },
            storage: diskStorage({
                destination: './profile',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UseGuards(SessionGuard)
    async updateProfilePicture(@Session() session, @UploadedFile() changeprofile: Express.Multer.File): Promise<string> {
        return await this.userService.updateProfilePicture(session.username, changeprofile);
    }



    //Update profile data
    @Put('updateprofile')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe())
    async updateProfile(@Session() session, @Body() data: UserUpdateDTO) {
        const checkemail = await this.userService.checkEmail(data.email);
        const checkusername = await this.userService.checkUsername(data.username);
        const profile = await this.userService.getUser(session.username);
        if (checkemail != null && data.email != profile.email) {
            throw new HttpException('Email already exist', HttpStatus.CONFLICT);
        }
        if (checkusername != null && data.username != profile.username) {
            throw new HttpException('Username already exist', HttpStatus.CONFLICT);
        }
        else {
            const update = this.userService.updateUser(profile.id, data);
            if (update) {
                session.username = data.username;
                return update;
            }
            
        }
    }



    //Change password
    @Patch('changepass')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe)
    async updatePass(@Session() session, @Body() data: UserUpdatePassDTO): Promise<any> {
        const profile = await this.userService.getUser(session.username);
        const oldpass = await this.userService.verifyPassword(profile.id, data);
        if (oldpass == true) {
            if (data.new_password != data.confirm_password) {
                throw new HttpException('New Password and confirm Password doesnt match', HttpStatus.NOT_ACCEPTABLE);
            }
            if (data.old_password == data.new_password) {
                throw new HttpException('New Password and old Password cant be same', HttpStatus.NOT_ACCEPTABLE);
            }
            else {
                return this.userService.changePassword(profile.id, data.confirm_password);
            }
        }
        else {
            throw new HttpException('Old Password doesnt match', HttpStatus.NOT_ACCEPTABLE);
        }

    }


    //delete User profile
    @Delete("deleteprofile")
    @UseGuards(SessionGuard)
    async deleteUser(@Session() session) {
        const profile = await this.userService.getUser(session.username);
        return this.userService.deleteUser(profile.id);
    }


    //Logout
    @Post('logout')
    signout(@Req() req) {
        if (req.session.destroy()) {
            return true;
        }
        else {
            throw new HttpException("invalid actions", HttpStatus.UNAUTHORIZED);
        }
    }



    /////////////////////////////////////////// profile part end here ///////////////////////////////////////////////////
}
