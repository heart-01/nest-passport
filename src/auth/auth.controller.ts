import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/interface/IUser';
import { LoginDTO } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  @Post('login')
  async login(
    @Request() req: { user: IUser },
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authService.login(req.user);
    return { accessToken };
  }
}
