import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/interface/IUser';
import { LoginDTO } from './dto/login.dto';
import { GoogleAuthGuard } from './google-auth.guard';
import {
  Request as RequestExpress,
  Response as ResponseExpress,
} from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  @Post('login')
  async login(
    @Request() req: { user: IUser },
    @Response({ passthrough: true }) res: ResponseExpress,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authService.login(req.user);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    return { accessToken };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req: RequestExpress) {
    // Initiates the Google OAuth process
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Request() req,
    @Response({ passthrough: true }) res: ResponseExpress,
  ) {
    const { accessToken } = await this.authService.googleLogin(req);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    return { accessToken };
    // res.redirect('/users/profile');
  }

  @Get('logout')
  async logout(@Request() req, @Response() res: ResponseExpress) {
    res.clearCookie('access_token', {
      httpOnly: true,
    });
    return res.json({ message: 'Successfully logged out' });
  }
}
