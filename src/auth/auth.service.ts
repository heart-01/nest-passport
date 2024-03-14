import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { IUser } from '../interface/IUser';
import * as bcrypt from 'bcrypt';
import { IPayloadJWT } from '../interface/IPayloadJWT';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUser(email: string, pass: string): Promise<IUser | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const result = user.toObject();
      return {
        userId: result._id,
        email: result.email,
        name: result.name,
        tel: result.tel,
      };
    }
    return null;
  }

  async login(user: IUser) {
    const payload: IPayloadJWT = { email: user.email, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new Error('Google login failed: No user information received.');
    }

    const { email, name, picture, googleId } = req.user;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        name,
        picture,
        googleId,
      });
      await user.save();
    }

    const payload: IPayloadJWT = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
