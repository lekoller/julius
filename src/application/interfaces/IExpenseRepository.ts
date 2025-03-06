import { Expense } from '../../domain/entities/Expense';

export interface IExpenseRepository {
  save(expense: Expense): Promise<void>;
  getAll(): Promise<Expense[]>;
  getAllBetweenDates(startDate: Date, endDate: Date): Promise<Expense[]>;
  delete(expense: Expense): Promise<void>;
  update(expense: Expense): Promise<void>;
} 