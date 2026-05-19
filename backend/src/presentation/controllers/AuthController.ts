import { Request, Response } from "express";
import { ILoginUseCase } from "../../application/interfaces/auth/ILoginUseCase";


export class AuthController {

  constructor(
    private readonly _loginUseCase: ILoginUseCase
  ) {}

  async login(
    req: Request,
    res: Response
  ): Promise<void> {

    try {

      const { email, password } = req.body;

      const token = await this._loginUseCase.execute(
        email,
        password
      );

      res.status(200).json({
        success: true,
        token
      });

    } catch (error: any) {

      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}