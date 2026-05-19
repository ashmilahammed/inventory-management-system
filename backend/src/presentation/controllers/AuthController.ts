import { Request, Response } from "express";
import { ILoginUseCase } from "../../application/interfaces/auth/ILoginUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { Messages } from "../../shared/constants/messages";
import { ApiResponse } from "../../shared/common/ApiResponse";


export class AuthController {
  constructor(
    private readonly _loginUseCase: ILoginUseCase
  ) {}


  async login(req: Request, res: Response): Promise<void> {
    try {
      
      const { email, password } = req.body;
      const token = await this._loginUseCase.execute(email, password);

      res.status(HttpStatus.OK).json(
        ApiResponse.success(Messages.LOGIN_SUCCESS, { token })
      );

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.UNAUTHORIZED).json(
        ApiResponse.error(message)
      );
    }
  }
}