export interface ILoginUseCase {

  execute(
    email: string,
    password: string
  ): Promise<string>;

}