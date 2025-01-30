import { DotenvConfig } from '../config/env.config';
import { Role } from '../constant/enum';
import { IJwtOptions, IJwtPayload } from '../interface/jwt.interface';
import jwt from 'jsonwebtoken';
class WebTokenService {
  sign(user: IJwtPayload, options: IJwtOptions, role: Role): string {
    return jwt.sign(
      {
        id:user.id,
        role
      },
      options.secret,
    )
  }

  verify(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

  generateTokens(user: IJwtPayload, role: Role): { accessToken: string; } {
    console.log(typeof DotenvConfig.ACCESS_TOKEN_EXPIRES_IN, DotenvConfig.ACCESS_TOKEN_EXPIRES_IN)
    const accessToken = this.sign(
      user,
      {
        expiresIn: DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
        secret: DotenvConfig.ACCESS_TOKEN_SECRET,
      },
      role,
    );
    
    return { accessToken};
  }
}

export default new WebTokenService();
