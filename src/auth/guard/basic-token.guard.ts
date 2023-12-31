import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

/*
 * 1) get token from authorization header
 * 2) extract token from authservice.extractTokenFromHeader
 * 3) extract email and password
 * 4) find user from email and password
 * 5) add the found user to request
 *    req.user = user;
 */
@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException("Token doesn't exist");
    }
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const { email, password } = this.authService.decodeBasicToken(token);
    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password
    });
    req.user = user;

    return true;
  }
}
