import { User } from '../../domain/entities/User';
import { Expense } from '../../domain/entities/Expense';
import { Income } from '../../domain/entities/Income';

export interface IUserRepository {
  save(user: User): Promise<void>;
  get(): Promise<User | null>;
  update(user: User): Promise<void>;
  exists(): Promise<boolean>;
  
  // Methods for expenses and incomes
  getExpenses(limit?: number): Promise<Expense[]>;
  getIncomes(limit?: number): Promise<Income[]>;
  addExpense(expense: Expense): Promise<void>;
  addIncome(income: Income): Promise<void>;
} 