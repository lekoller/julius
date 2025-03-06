import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserRepository } from '../../application/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';
import { Budget } from '../../domain/entities/Budget';
import { CycleVO } from '../../domain/value-objects/CycleVO';
import { Expense } from '../../domain/entities/Expense';
import { Income } from '../../domain/entities/Income';
import { UserDTO } from '../dtos/UserDTO';
import { ExpenseDTO } from '../dtos/ExpenseDTO';
import { IncomeDTO } from '../dtos/IncomeDTO';
import { AsyncStorageExpenseRepository } from './AsyncStorageExpenseRepository';

const USER_STORAGE_KEY = '@julius:user';
const EXPENSES_STORAGE_KEY = '@julius:expenses';
const INCOMES_STORAGE_KEY = '@julius:incomes';

export class AsyncStorageUserRepository implements IUserRepository {
  private static instance: AsyncStorageUserRepository;
  private user: User | null = null;
  private expenseRepository: AsyncStorageExpenseRepository;

  private constructor() {
    this.expenseRepository = new AsyncStorageExpenseRepository();
  }

  public static getInstance(): AsyncStorageUserRepository {
    if (!AsyncStorageUserRepository.instance) {
      AsyncStorageUserRepository.instance = new AsyncStorageUserRepository();
    }
    return AsyncStorageUserRepository.instance;
  }

  async save(user: User): Promise<void> {
    console.log('[AsyncStorageUserRepository] Saving user data:', {
      mensalIncome: user.mensalIncome,
      fixedExpense: user.fixedExpense,
      mensalMandatorySavings: user.mensalMandatorySavings,
      budget: {
        dailyValue: user.budget.dailyValue,
        dailyRenewalHour: user.budget.dailyRenewalHour,
        cycle: user.budget.cycle ? {
          name: user.budget.cycle.name,
          renewalHour: user.budget.cycle.renewalHour,
          renewalDay: user.budget.cycle.renewalDay,
          renewalMonth: user.budget.cycle.renewalMonth,
        } : null,
        balance: user.budget.balance,
      },
    });

    const userDTO: UserDTO = {
      mensalIncome: user.mensalIncome,
      fixedExpense: user.fixedExpense,
      mensalMandatorySavings: user.mensalMandatorySavings,
      budget: {
        dailyValue: user.budget.dailyValue,
        dailyRenewalHour: user.budget.dailyRenewalHour,
        cycle: user.budget.cycle ? {
          name: user.budget.cycle.name,
          renewalHour: user.budget.cycle.renewalHour,
          renewalDay: user.budget.cycle.renewalDay,
          renewalMonth: user.budget.cycle.renewalMonth,
        } : null,
        balance: user.budget.balance,
      },
      expenses: [],
      incomes: []
    };

    const jsonString = JSON.stringify(userDTO);
    console.log('[AsyncStorageUserRepository] Saving to storage:', jsonString);
    
    await AsyncStorage.setItem(USER_STORAGE_KEY, jsonString);
    this.user = user;
    console.log('[AsyncStorageUserRepository] User data saved successfully');
  }

  async get(): Promise<User | null> {
    // Return cached user if available
    if (this.user) {
      console.log('[AsyncStorageUserRepository] Returning cached user data');
      return this.user;
    }

    console.log('[AsyncStorageUserRepository] Fetching user data from storage');
    const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
    
    if (!userJson) {
      console.log('[AsyncStorageUserRepository] No user data found in storage');
      return null;
    }

    console.log('[AsyncStorageUserRepository] Retrieved user data:', userJson);
    const userDTO: UserDTO = JSON.parse(userJson);
    
    let cycle: CycleVO | null = null;
    if (userDTO.budget.cycle) {
      cycle = new CycleVO(
        userDTO.budget.cycle.name,
        userDTO.budget.cycle.renewalHour,
        userDTO.budget.cycle.renewalDay,
        userDTO.budget.cycle.renewalMonth,
      );
    }

    const budget = new Budget(
      userDTO.budget.dailyValue,
      userDTO.budget.dailyRenewalHour,
      cycle,
      userDTO.budget.balance,
    );

    this.user = new User(
      userDTO.mensalIncome,
      userDTO.fixedExpense,
      userDTO.mensalMandatorySavings,
      budget,
    );

    const currentDayExpenses = await this.expenseRepository.getCurrentDayExpenses(
      budget.dailyRenewalHour
    );
    
    if (this.user) {
      this.user.expenses = currentDayExpenses;
    }

    console.log('[AsyncStorageUserRepository] User data reconstructed successfully with current day expenses');
    return this.user;
  }

  async update(user: User): Promise<void> {
    console.log('[AsyncStorageUserRepository] Updating user data');
    await this.save(user);
  }

  async exists(): Promise<boolean> {
    const user = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const exists = user !== null;
    console.log('[AsyncStorageUserRepository] Checking if user exists:', exists);
    return exists;
  }

  async getExpenses(limit?: number): Promise<Expense[]> {
    console.log('[AsyncStorageUserRepository] Fetching expenses, limit:', limit);
    const expensesJson = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!expensesJson) {
      console.log('[AsyncStorageUserRepository] No expenses found');
      return [];
    }

    const expensesDTO: ExpenseDTO[] = JSON.parse(expensesJson);
    let expenses = expensesDTO.map(dto => Expense.fromJSON(dto));

    // Sort by timestamp descending
    expenses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit if specified
    if (limit) {
      expenses = expenses.slice(0, limit);
    }

    console.log('[AsyncStorageUserRepository] Retrieved expenses:', expenses.length);
    return expenses;
  }

  async getIncomes(limit?: number): Promise<Income[]> {
    console.log('[AsyncStorageUserRepository] Fetching incomes, limit:', limit);
    const incomesJson = await AsyncStorage.getItem(INCOMES_STORAGE_KEY);
    if (!incomesJson) {
      console.log('[AsyncStorageUserRepository] No incomes found');
      return [];
    }

    const incomesDTO: IncomeDTO[] = JSON.parse(incomesJson);
    let incomes = incomesDTO.map(dto => Income.fromJSON(dto));

    // Sort by timestamp descending
    incomes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit if specified
    if (limit) {
      incomes = incomes.slice(0, limit);
    }

    console.log('[AsyncStorageUserRepository] Retrieved incomes:', incomes.length);
    return incomes;
  }

  async addExpense(expense: Expense): Promise<void> {
    console.log('[AsyncStorageUserRepository] Adding expense:', expense);
    const expenses = await this.getExpenses();
    expenses.push(expense);
    
    const expensesDTO: ExpenseDTO[] = expenses.map(e => ({
      id: e.id,
      value: e.value,
      name: e.name,
      timestamp: e.timestamp.toISOString(),
      category: e.category,
      items: e.items.map(item => item.toJSON()),
    }));

    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expensesDTO));
    console.log('[AsyncStorageUserRepository] Expense added successfully');
  }

  async addIncome(income: Income): Promise<void> {
    console.log('[AsyncStorageUserRepository] Adding income:', income);
    const incomes = await this.getIncomes();
    incomes.push(income);
    
    const incomesDTO: IncomeDTO[] = incomes.map(i => ({
      id: i.id,
      value: i.value,
      name: i.name,
      timestamp: i.timestamp.toISOString(),
    }));

    await AsyncStorage.setItem(INCOMES_STORAGE_KEY, JSON.stringify(incomesDTO));
    console.log('[AsyncStorageUserRepository] Income added successfully');
  }

  // Helper method to clear all data (useful for testing or resetting the app)
  async clearAll(): Promise<void> {
    console.log('[AsyncStorageUserRepository] Clearing all data');
    await Promise.all([
      AsyncStorage.removeItem(USER_STORAGE_KEY),
      AsyncStorage.removeItem(EXPENSES_STORAGE_KEY),
      AsyncStorage.removeItem(INCOMES_STORAGE_KEY),
    ]);
    this.user = null;
    console.log('[AsyncStorageUserRepository] All data cleared successfully');
  }
} 