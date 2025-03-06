import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerScreenProps as DrawerScreenPropsBase } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NavigatorScreenParams } from "@react-navigation/native";

export type CycleFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type Transaction = {
  id: string;
  type: "expense" | "income";
  amount: number;
  description: string;
  date: string;
};

export type RootStackParamList = {
  Welcome: undefined;
  SetBudget: undefined;
  BudgetHelp: undefined;
  BudgetAmount: { frequency: CycleFrequency };
  BudgetConfirmation: {
    dailyBudget: number;
    frequency: CycleFrequency;
    income: number;
    fixedExpenses: number;
    targetSavings: number;
  };
  Main: NavigatorScreenParams<DrawerParamList>;
  AddExpense: undefined;
  AddIncome: undefined;
  ExpenseDetails: { expenseId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type DrawerParamList = {
  Main: undefined;
  History: undefined;
  ConfigureCycle: undefined;
  EditBudget: undefined;
  Settings: undefined;
};

export type DrawerScreenProps<T extends keyof DrawerParamList> =
  CompositeScreenProps<
    DrawerScreenPropsBase<DrawerParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
