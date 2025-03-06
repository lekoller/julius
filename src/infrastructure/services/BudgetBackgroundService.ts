import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { AsyncStorageUserRepository } from '../persistence/AsyncStorageUserRepository';
import { User } from '../../domain/entities/User';
import { Budget } from '../../domain/entities/Budget';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_UPDATE_KEY = '@julius:last_budget_update';
const BACKGROUND_FETCH_TASK = 'BACKGROUND_FETCH_TASK';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const service = BudgetBackgroundService.getInstance();
    await service.checkAndUpdateBudget();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[BudgetBackgroundService] Background fetch failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export class BudgetBackgroundService {
  private static instance: BudgetBackgroundService;
  private userRepository: AsyncStorageUserRepository;

  private constructor() {
    this.userRepository = AsyncStorageUserRepository.getInstance();
  }

  public static getInstance(): BudgetBackgroundService {
    if (!BudgetBackgroundService.instance) {
      BudgetBackgroundService.instance = new BudgetBackgroundService();
    }
    return BudgetBackgroundService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Register the background fetch task
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 15 * 60, // 15 minutes in seconds
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error('[BudgetBackgroundService] Failed to initialize:', error);
      throw error;
    }
  }

  public async checkAndUpdateBudget(): Promise<void> {
    try {
      const user = await this.userRepository.get();
      if (!user) return;

      const shouldUpdateBudget = await this.shouldUpdateBudget(user);
      if (shouldUpdateBudget) {
        await this.updateBudget(user);
        await AsyncStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());
      }
    } catch (error) {
      console.error('[BudgetBackgroundService] Failed to check and update budget:', error);
      throw error;
    }
  }

  private async shouldUpdateBudget(user: User): Promise<boolean> {
    const now = new Date();
    const budget = user.budget;
    const renewalHour = budget.dailyRenewalHour;
    const currentHour = now.getHours();

    const lastUpdateStr = await AsyncStorage.getItem(LAST_UPDATE_KEY);
    const lastUpdate = lastUpdateStr ? new Date(lastUpdateStr) : null;

    if (!lastUpdate) {
      return currentHour >= renewalHour;
    }

    const isDifferentDay = lastUpdate.getDate() !== now.getDate() ||
                          lastUpdate.getMonth() !== now.getMonth() ||
                          lastUpdate.getFullYear() !== now.getFullYear();

    return isDifferentDay && currentHour >= renewalHour;
  }

  private async updateBudget(user: User): Promise<void> {
    try {
      const newBalance = user.budget.balance + user.budget.dailyValue;
      
      const updatedBudget = new Budget(
        user.budget.dailyValue,
        user.budget.dailyRenewalHour,
        user.budget.cycle,
        newBalance
      );

      const updatedUser = new User(
        user.mensalIncome,
        user.fixedExpense,
        user.mensalMandatorySavings,
        updatedBudget
      );

      await this.userRepository.save(updatedUser);
    } catch (error) {
      console.error('[BudgetBackgroundService] Failed to update budget:', error);
      throw error;
    }
  }
} 