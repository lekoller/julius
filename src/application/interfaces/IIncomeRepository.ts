import { Income } from '../../domain/entities/Income';

export interface IIncomeRepository {
  save(income: Income): Promise<void>;
  getAll(): Promise<Income[]>;
  getAllBetweenDates(startDate: Date, endDate: Date): Promise<Income[]>;
  delete(income: Income): Promise<void>;
  update(income: Income): Promise<void>;
} 