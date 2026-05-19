export interface IDeleteItemUseCase {
  execute(id: string): Promise<boolean>;
}
