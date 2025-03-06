import AsyncStorage from '@react-native-async-storage/async-storage';
import { IExpenseRepository } from '../../application/interfaces/IExpenseRepository';
import { Expense } from '../../domain/entities/Expense';
import { Product } from '../../domain/entities/Product';
import { Service } from '../../domain/entities/Service';
import { ExpenseDTO, ProductDTO, ServiceDTO } from '../dtos/ExpenseDTO';

const EXPENSES_STORAGE_KEY = '@julius:expenses';

export class AsyncStorageExpenseRepository implements IExpenseRepository {
  async save(expense: Expense): Promise<void> {
    const expenses = await this.getAll();
    expenses.push(expense);
    
    const expenseDTOs = expenses.map(e => this.toDTO(e));
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenseDTOs));
  }

  async getAll(): Promise<Expense[]> {
    const expensesJson = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!expensesJson) return [];

    const expenseDTOs: ExpenseDTO[] = JSON.parse(expensesJson);
    return expenseDTOs.map(dto => this.fromDTO(dto));
  }

  async getAllBetweenDates(startDate: Date, endDate: Date): Promise<Expense[]> {
    const expenses = await this.getAll();
    return expenses.filter(expense => {
      const expenseDate = expense.timestamp;
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }

  async getCurrentDayExpenses(renewalHour: number = 0): Promise<Expense[]> {
    const now = new Date();
    const currentHour = now.getHours();
    
    let startOfDay: Date;
    let endOfDay: Date;

    if (currentHour < renewalHour) {
      // If current time is before renewal hour, include expenses from previous day after renewal hour
      startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, renewalHour);
      endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), renewalHour);
    } else {
      // If current time is after renewal hour, only include expenses from current day after renewal hour
      startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), renewalHour);
      endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, renewalHour);
    }
    
    return this.getAllBetweenDates(startOfDay, endOfDay);
  }

  async delete(expense: Expense): Promise<void> {
    const expenses = await this.getAll();
    const index = expenses.findIndex(
      e => e.timestamp.getTime() === expense.timestamp.getTime()
    );
    
    if (index === -1) {
      throw new Error('Expense not found');
    }

    expenses.splice(index, 1);
    await AsyncStorage.setItem(
      EXPENSES_STORAGE_KEY,
      JSON.stringify(expenses.map(e => this.toDTO(e)))
    );
  }

  async update(expense: Expense): Promise<void> {
    const expenses = await this.getAll();
    const index = expenses.findIndex(
      e => e.timestamp.getTime() === expense.timestamp.getTime()
    );
    
    if (index === -1) {
      throw new Error('Expense not found');
    }

    expenses[index] = expense;
    await AsyncStorage.setItem(
      EXPENSES_STORAGE_KEY,
      JSON.stringify(expenses.map(e => this.toDTO(e)))
    );
  }

  private toDTO(expense: Expense): ExpenseDTO {
    return {
      id: expense.id,
      value: expense.value,
      name: expense.name,
      category: expense.category,
      items: expense.items?.map(item => {
        if (item instanceof Product) {
          const productDTO: ProductDTO = {
            type: 'product',
            name: item.name,
            category: item.category,
            unitaryValue: item.unitaryValue,
            quantity: item.quantity,
            kilogramValue: item.kilogramValue,
            weight: item.weight,
          };
          return productDTO;
        } else {
          const serviceDTO: ServiceDTO = {
            type: 'service',
            name: item.name,
            category: item.category,
            value: (item as Service).value,
            description: (item as Service).description,
          };
          return serviceDTO;
        }
      }),
      timestamp: expense.timestamp.toISOString(),
    };
  }

  private fromDTO(dto: ExpenseDTO): Expense {
    const expense = new Expense(dto.value, dto.name);
    if (dto.category) {
      expense.setCategory(dto.category);
    }
    
    const items = dto.items?.map(item => {
      if (item.type === 'product') {
        return new Product(
          item.name,
          item.category,
          item.unitaryValue,
          item.quantity,
          item.kilogramValue,
          item.weight,
        );
      } else {
        return new Service(
          item.name,
          item.category,
          item.value,
          item.description,
        );
      }
    });

    if (items) {
      items.forEach(item => expense.addItem(item));
    }
    Object.defineProperty(expense, '_timestamp', {
      value: new Date(dto.timestamp),
      writable: false,
    });

    return expense;
  }
} 