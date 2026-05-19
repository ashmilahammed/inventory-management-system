export interface IDeleteCustomerUseCase {
  execute(id: string): Promise<boolean>;
}
