import jwt from "jsonwebtoken";

export class JwtService {

  generateToken(userId: string): string {

    return jwt.sign(
      { userId },

      process.env.JWT_SECRET!,

      {
        expiresIn: "1d"
      }
    );
  }
}