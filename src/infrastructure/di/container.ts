import { AsyncStorageUserRepository } from '../persistence/AsyncStorageUserRepository';
import { AsyncStorageExpenseRepository } from '../persistence/AsyncStorageExpenseRepository';
import { AsyncStorageIncomeRepository } from '../persistence/AsyncStorageIncomeRepository';
import { UserService } from '../../application/services/UserService';
import { ExpenseService } from '../../application/services/ExpenseService';
import { IncomeService } from '../../application/services/IncomeService';
import { BudgetService } from '../../application/services/BudgetService';

class Container {
  private static instance: Container;
  private readonly services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeServices(): void {
    // Repositories
    const userRepository = AsyncStorageUserRepository.getInstance();
    const expenseRepository = new AsyncStorageExpenseRepository();
    const incomeRepository = new AsyncStorageIncomeRepository();

    // Services
    const userService = new UserService(userRepository);
    const expenseService = new ExpenseService(expenseRepository, userRepository);
    const incomeService = new IncomeService(incomeRepository, userRepository);
    const budgetService = new BudgetService(userRepository);

    // Register services
    this.services.set('userService', userService);
    this.services.set('expenseService', expenseService);
    this.services.set('incomeService', incomeService);
    this.services.set('budgetService', budgetService);
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    return service as T;
  }
}

export const container = Container.getInstance(); 