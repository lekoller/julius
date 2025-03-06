import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '../types';
import { AsyncStorageUserRepository } from '../../../infrastructure/persistence/AsyncStorageUserRepository';
import { Expense } from '../../../domain/entities/Expense';
import { LanguageContext } from '../../../../App';
import {
  getExpenseDetailsTitle,
  getExpenseDetailsAmountLabel,
  getExpenseDetailsDescriptionLabel,
  getExpenseDetailsDateLabel,
  getExpenseDetailsCategoryLabel,
  getExpenseDetailsItemsLabel,
  getExpenseDetailsLoading,
  getExpenseDetailsErrorNotFound,
  getExpenseDetailsErrorLoadFailed,
  getExpenseDetailsBackButton,
  getExpenseDetailsGoBackButton,
} from '../../texts/getters';

export const ExpenseDetailsScreen: React.FC<RootStackScreenProps<'ExpenseDetails'>> = ({ route, navigation }) => {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    loadExpense();
  }, [expenseId]);

  const loadExpense = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userRepository = AsyncStorageUserRepository.getInstance();
      const expenses = await userRepository.getExpenses();
      const foundExpense = expenses.find(e => e.id === expenseId);

      if (!foundExpense) {
        setError(getExpenseDetailsErrorNotFound(language));
        return;
      }

      setExpense(foundExpense);
    } catch (err) {
      console.error('Error loading expense:', err);
      setError(getExpenseDetailsErrorLoadFailed(language));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="bodyLarge">{getExpenseDetailsLoading(language)}</Text>
      </View>
    );
  }

  if (error || !expense) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
          {error ?? getExpenseDetailsErrorNotFound(language)}
        </Text>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          {getExpenseDetailsGoBackButton(language)}
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.contentCard}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {getExpenseDetailsTitle(language)}
          </Text>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {getExpenseDetailsAmountLabel(language)}
            </Text>
            <Text variant="displaySmall" style={[styles.amount, { color: theme.colors.error }]}>
              -${expense.value.toFixed(2)}
            </Text>
          </View>

          {!!expense.name && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                {getExpenseDetailsDescriptionLabel(language)}
              </Text>
              <Text variant="bodyLarge">{expense.name}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {getExpenseDetailsDateLabel(language)}
            </Text>
            <Text variant="bodyLarge">{formatDate(expense.timestamp)}</Text>
          </View>

          {expense.category && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                {getExpenseDetailsCategoryLabel(language)}
              </Text>
              <Text variant="bodyLarge">{expense.category}</Text>
            </View>
          )}

          {expense.items.length > 0 && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                {getExpenseDetailsItemsLabel(language)}
              </Text>
              {expense.items.map((item, index) => (
                <Card key={index} style={styles.itemCard}>
                  <Card.Content>
                    <Text variant="titleSmall">{item.name}</Text>
                    <Text variant="bodyMedium">{item.category}</Text>
                    <Text variant="bodyMedium">
                      ${item.calculateValue().toFixed(2)}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          )}

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            {getExpenseDetailsBackButton(language)}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentCard: {
    margin: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    opacity: 0.7,
  },
  amount: {
    textAlign: 'center',
  },
  itemCard: {
    marginTop: 8,
  },
  button: {
    width: '100%',
  },
  backButton: {
    width: '100%',
    marginTop: 16,
  },
}); 