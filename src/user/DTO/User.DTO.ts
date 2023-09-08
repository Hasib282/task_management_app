import { IsEmail, IsIn, IsNotEmpty, Matches } from "class-validator";




export class UserDTO {
    @Matches(/^[a-zA-Z][a-zA-Z\-\.\s]{2,150}$/, { message: "Name only contain a-z or A-Z or dot(.) or dash(-) and must start with a letter and atleast 2 charecter" })
    name: string;

    @Matches(/^.{4,150}$/, { message: "Name must contain  at least 2 charecters" })
    username: string;

    @IsEmail()
    email: string;

    bio: string;

    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, { message: "Password Must contain one upper letter,lower letter,digit and special character" })
    password: string;

    profilepic: string;
}


export class UserLoginDTO {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}



export class UserUpdateDTO {
    @Matches(/^[a-zA-Z][a-zA-Z\-\.\s]{2,150}$/, { message: "Name only contain a-z or A-Z or dot(.) or dash(-) and must start with a letter and atleast 2 charecter" })
    name: string;

    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    bio: string;

}



export class UserUpdatePassDTO {
    @IsNotEmpty()
    old_password: string;

    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, { message: "Must contain one upper letter,lower letter,digit and special character" })
    new_password: string;

    @IsNotEmpty()
    confirm_password: string;

}