import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { HashService } from "../infrastructure/services/HashService";
import { JwtService } from "../infrastructure/services/JwtService";
import { LoginUseCase } from "../application/usecases/auth/LoginUseCase";
import { AuthController } from "../presentation/controllers/AuthController";


const userRepository = new UserRepository();
const hashService = new HashService();
const jwtService = new JwtService();


const loginUseCase = new LoginUseCase(
  userRepository,
  hashService,
  jwtService
);

export const authController = new AuthController(
  loginUseCase
);