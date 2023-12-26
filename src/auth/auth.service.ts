import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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
}
