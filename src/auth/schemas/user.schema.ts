import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<User>;

type UserRole = 'customer' | 'admin';

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'customer' })
    role: UserRole;

    @Prop({ required: true })
    address: string;

    @Prop({ default: false })
    isDeleted: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);