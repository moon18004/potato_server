import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}
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
    const passOk = bcrypt.compare(user.password, existingUser.password); // will return true if password is correct
    if (!passOk) {
      throw new UnauthorizedException('User does not exist or password is not correct');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  async registerWithEmail(user: Pick<UsersModel, 'nickname' | 'email' | 'password' | 'country'>) {
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);
    const newUser = await this.usersService.createUser(user);

    return this.loginUser(newUser);
  }
}
