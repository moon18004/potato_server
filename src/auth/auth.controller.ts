import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken
    };
  }
  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken
    };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  loginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  registerEmail(
    @Body() body: RegisterUserDto
    // @Body('nickname') nickname: string,
    // @Body('email') email: string,
    // @Body('password', new MaxLengthPipe(16, 'password'), new MinLengthPipe(8, 'password'))
    // password: string,
    // @Body('country') country: string
  ) {
    return this.authService.registerWithEmail(body);
  }
  @Post('verify')
  // @UseGuards(AccessTokenGuard)
  verifyToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    return this.authService.verifyToken(token);
  }
  @Get(':email')
  @UseGuards(AccessTokenGuard)
  getUser(@Param('email') email: string) {
    return this.authService.getUserByEmail(email);
  }

  @Patch('edit/:email')
  @UseGuards(AccessTokenGuard)
  patchUser(@Param('email') email: string, @Body() body: EditUserDto) {
    return this.authService.updateUser(email, body);
  }
}
