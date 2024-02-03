import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}
  /*
   * Token
   * 1) accessToken and refreshToken issued from login or register
   * 2) when log in, send with basic token
   *    Basic token is a form incoded from 'email:password' to Base64
   *    ex) {authorization: 'Basic {token}'}
   * 3) when access to private route, send accessToken in Header
   *    ex) {authorization: 'Bearer {token}'}
   * 4) server can know the user who send request through token validation
   *    can get user id from sub value of token
   * 5) all token has expiration date. when expired, have to get new token
   *    can issue new access token through refresh token.
   *
   * 6) when token is expired, request to get a new token
   */

  /*
   * {authorization: 'Basic {token}'}
   * {authorization: 'Bearer {token}'}
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('Wrong token!');
    }
    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('Wrong Token');
    }
    const email = split[0];
    const password = split[1];
    return {
      email,
      password
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_SECRET
      });
    } catch (e) {
      throw new UnauthorizedException('Token is expired or wrong');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: JWT_SECRET
    });
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Token reissuance should be with refresh token.');
    }
    // console.log(decoded);

    return this.signToken(
      {
        ...decoded
      },
      isRefreshToken
    );
  }

  /*
   * 1) RegisterWithEmail
   *    - Register with email, password
   * 		- return accessToken and refreshToken
   *
   * 2) loginWithEmail
   * 		- process user verification
   *    - return accessToken and refreshToken
   *
   * 3) loginUser
   * 		- Logic returning accessToken and refreshToken to (1) and (2)
   *
   * 4) signToken
   * 		- Generate accessToken and refreshToken required for (3)
   *
   * 5) authenticateWithEmailAndPassword
   * 		- verification process when logging in (check Id and password)
   * 			1. if user exists (email)
   * 			2. check password
   * 			3. if passed, return user information
   * 			4. generate token based on the data from loginWithEmail
   */

  /*
   * Payload에 들어갈 정보
   * 1) email
   * 2) sub => id
   * 3) type : 'access' | 'refresh'
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access'
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 86400 : 1800
    });
  }
  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true)
    };
  }
  async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
    // check if the user exists(email)
    const existingUser = await this.usersService.getUserByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException('User does not exist or password is not correct');
    }

    // check the password is correct
    // pass password input and hash for arguments
    const passOk = await bcrypt.compare(user.password, existingUser.password); // will return true if password is correct
    // console.log(passOk);
    if (!passOk) {
      throw new UnauthorizedException('User does not exist or password is not correct');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }
  
  async registerWithEmail(user: RegisterUserDto) {
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);
    // console.log(user);
    const newUser = await this.usersService.createUser({
      ...user,
      password: hash
    });
    // const newUser = await this.usersService.createUser(user);

    return this.loginUser(newUser);
  }
}
