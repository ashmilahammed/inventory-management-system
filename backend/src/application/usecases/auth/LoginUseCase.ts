import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { HashService } from "../../../infrastructure/services/HashService";
import { JwtService } from "../../../infrastructure/services/JwtService";
import { ILoginUseCase } from "../../interfaces/auth/ILoginUseCase";


export class LoginUseCase implements ILoginUseCase {

  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _hashService: HashService,
    private readonly _jwtService: JwtService
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<string> {

    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatch =
      await this._hashService.comparePassword(
        password,
        user.password
      );

    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = this._jwtService.generateToken(
      user._id!
    );

    return token;
  }
}