import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { compare, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly jwtAuthService: JwtService
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        const passhash = await hash(createUserDto.password, 10);
        createUserDto.password = passhash
        const user = await this.userModel.create(createUserDto);
        const privateUser = {
            name: user.name,
            email: user.email,
            address: user.address
        }
        return privateUser;
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const findUser = await this.userModel.findOne({ email: loginUserDto.email });

        if (!findUser) throw new NotFoundException('USER_NOT_FOUND');

        const checkPassword = await compare(loginUserDto.password, findUser.password);

        if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);

        const payload = { id: findUser._id, name: findUser.name }
        const token = this.jwtAuthService.sign(payload);

        const data = {
            user: findUser,
            token
        };

        return data;
    }
}
