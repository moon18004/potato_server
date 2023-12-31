import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException("Token doesn't exist");
    }
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const result = await this.authService.verifyToken(token);

    const user = await this.usersService.getUserByEmail(result.email);
    // user info, token, tokenType= access | refresh
    req.user = user;
    req.token = token;
    req.tokenType = result.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();
    if (req.tokenType !== 'access') {
      throw new UnauthorizedException("It's not Access Token");
    }
    return true;
  }
}
@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();
    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException("It's not Refresh Token");
    }
    return true;
  }
}
