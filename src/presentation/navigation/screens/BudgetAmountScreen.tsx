import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Button, Card, TextInput, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '../types';
import { CycleFrequency } from '../types';
import { LanguageContext } from '../../../../App';
import {
  getBudgetAmountTitle,
  getBudgetAmountDescription,
  getBudgetAmountIncomeLabel,
  getBudgetAmountFixedExpensesLabel,
  getBudgetAmountTargetSavingsLabel,
  getCommonEnterAmountPlaceholder,
} from '../../texts/getters';

export const BudgetAmountScreen: React.FC<RootStackScreenProps<'BudgetAmount'>> = ({ route, navigation }) => {
  const { frequency } = route.params;
  const [income, setIncome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState('');
  const [targetSavings, setTargetSavings] = useState('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'daily':
        return 'day';
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      case 'yearly':
        return 'year';
    }
  };

  const calculateDailyBudget = () => {
    const incomeValue = parseFloat(income);
    const expensesValue = parseFloat(fixedExpenses) || 0;
    const savingsValue = parseFloat(targetSavings) || 0;

    if (isNaN(incomeValue) || incomeValue <= 0) {
      setError('Please enter a valid income amount');
      return;
    }

    if (expensesValue + savingsValue >= incomeValue) {
      setError('Your expenses and savings cannot exceed your income');
      return;
    }

    const daysInPeriod: Record<CycleFrequency, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30.44, // Average days in a month
      yearly: 365.25, // Account for leap years
    };

    const availableDaily = (incomeValue - expensesValue - savingsValue) / daysInPeriod[frequency];
    const recommendedBudget = Math.floor(availableDaily / 5) * 5;

    navigation.navigate('BudgetConfirmation', {
      dailyBudget: recommendedBudget,
      frequency,
      income: incomeValue,
      fixedExpenses: expensesValue,
      targetSavings: savingsValue,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.contentCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              {getBudgetAmountTitle(language)}
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {getBudgetAmountDescription(language).replace('%s', getFrequencyLabel())}
            </Text>
            
            <View style={styles.form}>
              <TextInput
                label={getBudgetAmountIncomeLabel(language).replace('%s', getFrequencyLabel())}
                placeholder={getCommonEnterAmountPlaceholder(language)}
                keyboardType="numeric"
                value={income}
                onChangeText={(text) => {
                  setIncome(text);
                  setError(null);
                }}
                style={styles.input}
                mode="outlined"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              
              {(frequency === 'monthly' || frequency === 'yearly') && (
                <TextInput
                  label={getBudgetAmountFixedExpensesLabel(language)}
                  placeholder={getCommonEnterAmountPlaceholder(language)}
                  keyboardType="numeric"
                  value={fixedExpenses}
                  onChangeText={(text) => {
                    setFixedExpenses(text);
                    setError(null);
                  }}
                  style={styles.input}
                  mode="outlined"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              )}
              
              <TextInput
                label={getBudgetAmountTargetSavingsLabel(language)}
                placeholder={getCommonEnterAmountPlaceholder(language)}
                keyboardType="numeric"
                value={targetSavings}
                onChangeText={(text) => {
                  setTargetSavings(text);
                  setError(null);
                }}
                style={styles.input}
                mode="outlined"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              {error && (
                <Text variant="bodyMedium" style={[styles.error, { color: theme.colors.error }]}>
                  {error}
                </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={calculateDailyBudget}
                style={styles.button}
              >
                Calculate Budget
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.button}
              >
                Back
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  contentCard: {
    marginTop: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    width: '100%',
  },
  error: {
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
}); 