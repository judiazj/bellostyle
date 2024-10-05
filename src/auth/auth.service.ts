import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

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
}
