import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IPayloadJWT } from '../interface/IPayloadJWT';
import { User } from './schemas/user.schema';

@ApiTags('User')
@ApiBearerAuth('authorization')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  create(@Body() registerDTO: RegisterDTO): Promise<User> {
    return this.userService.create(registerDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req: { user: IPayloadJWT }): Promise<User> {
    const profile = await this.userService.findByEmail(req.user.email);
    return profile;
  }
}
