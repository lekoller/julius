import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '../types';
import { CycleFrequency } from '../types';
import { LanguageContext } from '../../../../App';
import {
  getBudgetHelpTitle,
  getBudgetHelpDescription,
  getBudgetHelpDailyButton,
  getBudgetHelpWeeklyButton,
  getBudgetHelpMonthlyButton,
  getBudgetHelpYearlyButton,
  getBudgetHelpBackButton,
} from '../../texts/getters';

export const BudgetHelpScreen: React.FC<RootStackScreenProps<'BudgetHelp'>> = ({ navigation }) => {
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);
  
  const handleFrequencySelect = (frequency: CycleFrequency) => {
    navigation.navigate('BudgetAmount', { frequency });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.contentCard}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {getBudgetHelpTitle(language)}
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            {getBudgetHelpDescription(language)}
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => handleFrequencySelect('daily')}
              style={styles.button}
            >
              {getBudgetHelpDailyButton(language)}
            </Button>
            <Button
              mode="contained"
              onPress={() => handleFrequencySelect('weekly')}
              style={styles.button}
            >
              {getBudgetHelpWeeklyButton(language)}
            </Button>
            <Button
              mode="contained"
              onPress={() => handleFrequencySelect('monthly')}
              style={styles.button}
            >
              {getBudgetHelpMonthlyButton(language)}
            </Button>
            <Button
              mode="contained"
              onPress={() => handleFrequencySelect('yearly')}
              style={styles.button}
            >
              {getBudgetHelpYearlyButton(language)}
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.button}
            >
              {getBudgetHelpBackButton(language)}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
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
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
}); 