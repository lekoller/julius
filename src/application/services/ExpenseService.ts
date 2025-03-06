import { Expense } from '../../domain/entities/Expense';
import { Consumable } from '../../domain/entities/Consumable';
import { IExpenseRepository } from '../interfaces/IExpenseRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { Income } from '../../domain/entities/Income';

export class ExpenseService {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async addExpense(
    value: number,
    name: string,
    category: string,
    items?: Consumable[]
  ): Promise<void> {
    const expense = new Expense(value, name);
    expense.setCategory(category);
    if (items) {
      items.forEach(item => expense.addItem(item));
    }
    
    const user = await this.userRepository.get();
    if (!user) {
      throw new Error('User not found');
    }

    user.addExpense(expense);
    await this.userRepository.update(user);
    
    await this.expenseRepository.save(expense);
  }

  async getAllExpenses(): Promise<Expense[]> {
    return await this.expenseRepository.getAll();
  }

  async getExpensesBetweenDates(startDate: Date, endDate: Date): Promise<Expense[]> {
    return await this.expenseRepository.getAllBetweenDates(startDate, endDate);
  }

  async updateExpense(
    oldExpense: Expense,
    newValue: number,
    newName: string,
    newCategory: string,
    newItems?: Consumable[]
  ): Promise<void> {
    const user = await this.userRepository.get();
    if (!user) {
      throw new Error('User not found');
    }

    // Remove old expense and add new one
    user.addIncome(new Income(oldExpense.value)); // Revert old expense
    const newExpense = new Expense(newValue, newName);
    newExpense.setCategory(newCategory);
    if (newItems) {
      newItems.forEach(item => newExpense.addItem(item));
    }
    user.addExpense(newExpense);
    
    await this.userRepository.update(user);
    await this.expenseRepository.update(newExpense);
  }

  async deleteExpense(expense: Expense): Promise<void> {
    const user = await this.userRepository.get();
    if (!user) {
      throw new Error('User not found');
    }

    // Revert expense by adding it as income
    user.addIncome(new Income(expense.value));
    await this.userRepository.update(user);
    await this.expenseRepository.delete(expense);
  }
} 