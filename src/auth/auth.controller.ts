import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/interface/IUser';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: IUser },
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authService.login(req.user);
    return { accessToken };
  }
}
