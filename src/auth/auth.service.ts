import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { IUser } from '../interface/IUser';
import * as bcrypt from 'bcrypt';
import { IPayloadJWT } from '../interface/IPayloadJWT';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
}
