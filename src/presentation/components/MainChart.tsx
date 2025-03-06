import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface, SegmentedButtons, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { User } from '../../domain/entities/User';
import {
  getMainChartTitle,
  getMainChartDayLabel,
  getMainChartWeekLabel,
  getMainChartMonthLabel,
} from '../texts/getters';
import { Language } from '../texts/getters';

type TimePeriod = 'day' | 'week' | 'month';

interface MainChartProps {
  user: User;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  language: Language;
}

export const MainChart: React.FC<MainChartProps> = ({ 
  user, 
  timePeriod, 
  onTimePeriodChange,
  language 
}) => {
  const theme = useTheme();

  const handleTimePeriodChange = (value: string) => {
    onTimePeriodChange(value as TimePeriod);
  };

  const getChartData = () => {
    if (!user) return null;

    const now = new Date();
    let labels: string[] = [];
    let data: number[] = [];

    switch (timePeriod) {
      case 'day':
        // Group expenses by hour for the current day
        const hourlyExpenses = new Array(24).fill(0);
        user.expenses.forEach(expense => {
          const expenseDate = expense.timestamp;
          if (expenseDate.toDateString() === now.toDateString()) {
            hourlyExpenses[expenseDate.getHours()] += expense.value;
          }
        });
        labels = Array.from({ length: 24 }, (_, i) => i % 2 === 0 ? `${i}h` : '');
        data = hourlyExpenses;
        break;
      case 'week':
        // Group expenses by day for the last 7 days
        const dailyExpenses = new Array(7).fill(0);
        const weekLabels = new Array(7).fill('');
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          weekLabels[6-i] = date.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { weekday: 'short' });
          const dayExpenses = user.expenses.filter(expense => {
            const expenseDate = expense.timestamp;
            return expenseDate.toDateString() === date.toDateString();
          });
          dailyExpenses[6-i] = dayExpenses.reduce((sum, expense) => sum + expense.value, 0);
        }
        labels = weekLabels;
        data = dailyExpenses;
        break;
      case 'month':
        // Group expenses by day for the last 30 days
        const monthlyExpenses = new Array(30).fill(0);
        const monthLabels = new Array(30).fill('');
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          monthLabels[29-i] = i % 5 === 0 || i === 0 ? date.getDate().toString() : '';
          const dayExpenses = user.expenses.filter(expense => {
            const expenseDate = expense.timestamp;
            return expenseDate.toDateString() === date.toDateString();
          });
          monthlyExpenses[29-i] = dayExpenses.reduce((sum, expense) => sum + expense.value, 0);
        }
        labels = monthLabels;
        data = monthlyExpenses;
        break;
    }

    return {
      labels,
      datasets: [{
        data: data,
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      }],
    };
  };

  return (
    <Surface style={styles.chartCard} elevation={2}>
      <View style={styles.chartHeader}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {getMainChartTitle(language)}
        </Text>
        <SegmentedButtons
          value={timePeriod}
          onValueChange={handleTimePeriodChange}
          buttons={[
            { value: 'day', label: getMainChartDayLabel(language) },
            { value: 'week', label: getMainChartWeekLabel(language) },
            { value: 'month', label: getMainChartMonthLabel(language) },
          ]}
          style={styles.periodSelector}
        />
      </View>
      
      {getChartData() && (
        <View style={styles.chartWrapper}>
          <LineChart
            data={getChartData()!}
            width={Dimensions.get('window').width - 80}
            height={220}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.onSurfaceVariant,
              propsForBackgroundLines: {
                strokeDasharray: '', // Solid lines
                stroke: theme.colors.surfaceVariant,
                strokeWidth: 1,
              },
              propsForLabels: {
                fontSize: '11',
                translateX: -20,
              },
              style: {
                borderRadius: 16,
                margin: 0,
              },
              formatYLabel: (value) => Math.round(parseFloat(value)).toString(),
            }}
            withVerticalLines={false}
            withHorizontalLabels={true}
            withInnerLines={true}
            fromZero={true}
            yAxisLabel=""
            yAxisSuffix=""
            segments={4}
            style={styles.chart}
            bezier
            getDotProps={() => ({
              r: '0',
            })}
            horizontalLabelRotation={0}
            verticalLabelRotation={0}
          />
        </View>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    borderRadius: 28,
    padding: 24,
    marginTop: 16,
  },
  chartHeader: {
    marginBottom: 16,
  },
  periodSelector: {
    marginTop: 8,
  },
  chartWrapper: {
    alignItems: 'center',
    marginLeft: -25,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 