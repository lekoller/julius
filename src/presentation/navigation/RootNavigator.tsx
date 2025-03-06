import React, { useEffect, useState } from 'react';
import { NavigationContainer, Theme as NavigationTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerHeaderProps } from '@react-navigation/drawer';
import { RootStackParamList, DrawerParamList, DrawerScreenProps } from './types';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { SetBudgetScreen } from './screens/SetBudgetScreen';
import { BudgetHelpScreen } from './screens/BudgetHelpScreen';
import { BudgetAmountScreen } from './screens/BudgetAmountScreen';
import { BudgetConfirmationScreen } from './screens/BudgetConfirmationScreen';
import { MainScreen } from './screens/MainScreen';
import { AddExpenseScreen } from './screens/AddExpenseScreen';
import { AddIncomeScreen } from './screens/AddIncomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ExpenseDetailsScreen } from './screens/ExpenseDetailsScreen';
import { ConfigureCycleScreen } from './screens/ConfigureCycleScreen';
import { EditBudgetScreen } from './screens/EditBudgetScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AsyncStorageUserRepository } from '../../infrastructure/persistence/AsyncStorageUserRepository';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Appbar, IconButton } from 'react-native-paper';
import { LanguageContext } from '../../../App';
import {
  getNavigationHistory,
  getNavigationChangeCycle,
  getNavigationEditBudget,
  getNavigationSettings,
  getNavigationLoading,
} from '../texts/getters';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const MainDrawer = () => {
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        header: ({ navigation: drawerNavigation, route }: DrawerHeaderProps) => (
          <Appbar.Header 
            style={{ 
              backgroundColor: theme.colors.surface,
              elevation: 0,
              shadowOpacity: 0,
              minHeight: 44,
            }}
            statusBarHeight={0}
          >
            <Appbar.Action
              icon="menu"
              onPress={() => drawerNavigation.openDrawer()}
              color={theme.colors.onSurface}
            />
            <Appbar.Content
              title={route.name === 'Main' ? 'Home' : route.name}
              titleStyle={{ color: theme.colors.onSurface }}
            />
          </Appbar.Header>
        ),
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: '80%',
        },
        drawerLabelStyle: {
          color: theme.colors.onSurface,
        },
        drawerActiveTintColor: theme.colors.primary,
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainScreen}
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="home" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          title: getNavigationHistory(language),
          drawerIcon: ({ color, size }) => (
            <IconButton icon="history" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ConfigureCycle" 
        component={ConfigureCycleScreen}
        options={{
          title: getNavigationChangeCycle(language),
          drawerIcon: ({ color, size }) => (
            <IconButton icon="calendar-sync" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="EditBudget" 
        component={EditBudgetScreen}
        options={{
          title: getNavigationEditBudget(language),
          drawerIcon: ({ color, size }) => (
            <IconButton icon="pencil" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: getNavigationSettings(language),
          drawerIcon: ({ color, size }) => (
            <IconButton icon="cog" size={size} iconColor={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Welcome' | 'Main'>('Welcome');
  const paperTheme = useTheme();
  const { language } = React.useContext(LanguageContext);

  const navigationTheme: NavigationTheme = {
    dark: paperTheme.dark,
    colors: {
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outline,
      notification: paperTheme.colors.error,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700',
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900',
      },
    },
  };

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userRepository = AsyncStorageUserRepository.getInstance();
        const userExists = await userRepository.exists();
        setInitialRoute(userExists ? 'Main' : 'Welcome');
      } catch (error) {
        console.error('Error checking user data:', error);
        setInitialRoute('Welcome');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: paperTheme.colors.background }}>
        <Text variant="titleMedium">{getNavigationLoading(language)}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: paperTheme.colors.background },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SetBudget" component={SetBudgetScreen} />
        <Stack.Screen name="BudgetHelp" component={BudgetHelpScreen} />
        <Stack.Screen name="BudgetAmount" component={BudgetAmountScreen} />
        <Stack.Screen name="BudgetConfirmation" component={BudgetConfirmationScreen} />
        <Stack.Screen name="Main" component={MainDrawer} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="AddIncome" component={AddIncomeScreen} />
        <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 