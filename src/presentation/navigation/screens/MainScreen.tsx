import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme, Surface, IconButton, SegmentedButtons } from 'react-native-paper';
import { DrawerScreenProps } from '../types';
import { AsyncStorageUserRepository } from '../../../infrastructure/persistence/AsyncStorageUserRepository';
import { User } from '../../../domain/entities/User';
import { EventEmitter } from '../../../infrastructure/services/EventEmitterService';
import { Budget } from '../../../domain/entities/Budget';
import { MainChart } from '../../components/MainChart';
import { LanguageContext } from '../../../../App';
import {
  getMainDailyBudgetLabel,
  getMainBalanceLabel,
  getMainSpentTodayLabel,
  getMainMaxSpendingLabel,
  getMainAddExpenseButton,
  getCommonRetryButton,
  getCommonSetUpBudgetButton,
  getCommonNoUserDataMessage,
} from '../../texts/getters';

export const MainScreen: React.FC<DrawerScreenProps<'Main'>> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentDaySpending, setCurrentDaySpending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('day');
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);
  
  useEffect(() => {
    loadUser();
    
    const handleBudgetUpdate = (updatedBudget: Budget) => {
      if (user) {
        const updatedUser = new User(
          user.mensalIncome,
          user.fixedExpense,
          user.mensalMandatorySavings,
          updatedBudget
        );
        setUser(updatedUser);
      }
    };

    EventEmitter.on('budget:updated', handleBudgetUpdate);

    return () => {
      EventEmitter.off('budget:updated', handleBudgetUpdate);
    };
  }, [user]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userRepository = AsyncStorageUserRepository.getInstance();
      const loadedUser = await userRepository.get();
      if (loadedUser) {
        setUser(loadedUser);

        const todayExpenses = loadedUser.expenses;
        const totalSpending = todayExpenses.reduce((sum, expense) => sum + expense.value, 0);

        setCurrentDaySpending(totalSpending);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={styles.contentContainer}>
          <Text variant="bodyLarge" style={{ color: theme.colors.error }}>{error}</Text>
          <Button
            mode="contained"
            onPress={loadUser}
            style={styles.button}
          >
            {getCommonRetryButton(language)}
          </Button>
        </View>
      </ScrollView>
    );
  }

  if (!user) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={styles.contentContainer}>
          <Text variant="bodyLarge">{getCommonNoUserDataMessage(language)}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.getParent()?.navigate('Welcome')}
            style={styles.button}
          >
            {getCommonSetUpBudgetButton(language)}
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: 'transparent' }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>
        <Surface style={styles.budgetCard} elevation={2}>
          <View style={styles.headerRow}>
            <View style={styles.budgetLabelContainer}>
              <Text variant="titleLarge" style={[styles.budgetLabel, { color: theme.colors.onSurfaceVariant }]}>
                {getMainDailyBudgetLabel(language)}{' '}
              </Text>
              <Text variant="titleLarge" style={[styles.budgetLabel, { color: theme.colors.primary }]}>
                ${user.budget.dailyValue.toFixed(2)}
              </Text>
            </View>
            <View style={styles.gainButtonContainer}>
              <IconButton
                icon="plus"
                mode="outlined"
                size={24}
                onPress={() => navigation.getParent()?.navigate('AddIncome')}
                style={styles.gainButton}
                iconColor={theme.colors.primary}
              />
            </View>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.balanceSection}>
              <Text variant="labelMedium" style={[styles.valueLabel, { color: theme.colors.onSurfaceVariant }]}>
                {getMainBalanceLabel(language)}
              </Text>
              <Text variant="displayLarge" style={[styles.balance, { color: theme.colors.onSurface }]}>
                ${user.budget.balance.toFixed(2)}
              </Text>
            </View>

            <View style={styles.spendingSection}>
              <Text variant="labelMedium" style={[styles.valueLabel, { color: theme.colors.onSurfaceVariant }]}>
                {getMainSpentTodayLabel(language)}
              </Text>
              <Text variant="headlineMedium" style={[styles.currentDaySpending, { color: theme.colors.tertiary }]}>
                ${currentDaySpending.toFixed(2)}
              </Text>
            </View>
          </View>

          {user.budget.opd !== null && (
            <Text variant="bodyLarge" style={[styles.opdLabel, { color: theme.colors.secondary }]}>
              {getMainMaxSpendingLabel(language).replace('%s', user.budget.opd.toFixed(2))}
            </Text>
          )}
        </Surface>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.getParent()?.navigate('AddExpense')}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {getMainAddExpenseButton(language)}
          </Button>
        </View>

        <MainChart
          user={user}
          timePeriod={timePeriod}
          onTimePeriodChange={setTimePeriod}
          language={language}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32, // Add extra padding at the bottom for scrolling
  },
  budgetCard: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 32,
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  budgetLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 16,
  },
  budgetLabel: {
    flexShrink: 1,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  balanceSection: {
    flex: 3,
  },
  spendingSection: {
    flex: 2,
    alignItems: 'flex-end',
  },
  valueLabel: {
    marginBottom: 8,
  },
  balance: {
    lineHeight: 56,
  },
  currentDaySpending: {
    lineHeight: 40,
  },
  opdLabel: {
    textAlign: 'left',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonContent: {
    height: 48,
  },
  gainButtonContainer: {
    alignItems: 'center',
  },
  gainButton: {
    borderRadius: 8,
    width: 58,
    height: 58,
  },
}); 