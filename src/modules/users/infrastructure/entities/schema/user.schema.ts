import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Este es el tipo que usarás en el repositorio de Mongo
export type UserDocument = UserMongo & Document;

@Schema({ timestamps: true, collection: 'users', versionKey: false })
export class UserMongo {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserMongo);
