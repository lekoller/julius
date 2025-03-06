import { Income } from '../../domain/entities/Income';
import { IIncomeRepository } from '../interfaces/IIncomeRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { Expense } from '../../domain/entities/Expense';

export class IncomeService {
  constructor(
    private readonly incomeRepository: IIncomeRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async addIncome(value: number, name?: string): Promise<void> {
    const income = new Income(value, name);
    
    const user = await this.userRepository.get();
    if (!user) {
      throw new Error('User not found');
    }

    user.addIncome(income);
    await this.userRepository.update(user);
    
    await this.incomeRepository.save(income);
  }

  async getAllIncomes(): Promise<Income[]> {
    return await this.incomeRepository.getAll();
  }

  async getIncomesBetweenDates(startDate: Date, endDate: Date): Promise<Income[]> {
    return await this.incomeRepository.getAllBetweenDates(startDate, endDate);
  }

  async updateIncome(oldIncome: Income, newValue: number, newName?: string): Promise<void> {
    const user = await this.userRepository.get();
    if (!user) {
      throw new Error('User not found');
    }

    // Remove old income and add new one
    user.addExpense(new Expense(oldIncome.value)); // Revert old income
    const newIncome = new Income(newValue, newName);
    user.addIncome(newIncome);
    
    await this.userRepository.update(user);
    await this.incomeRepository.update(newIncome);
  }

  async deleteIncome(income: Income): Promise<void> {
    const user = await this.userRepository.get();
    if (!user) {
      throw new Error('User not found');
    }

    // Revert income by adding it as an expense
    user.addExpense(new Expense(income.value));
    await this.userRepository.update(user);
    await this.incomeRepository.delete(income);
  }
} 