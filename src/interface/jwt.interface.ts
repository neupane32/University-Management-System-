export interface IJwtOptions {
    secret: string;
    expiresIn: string | number;
  }
  export interface IJwtPayload {
    id: string;
  }
  