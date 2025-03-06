// Navigation
export const NAVIGATION_HISTORY = 'History';
export const NAVIGATION_CHANGE_CYCLE = 'Change Cycle';
export const NAVIGATION_EDIT_BUDGET = 'Edit Budget';
export const NAVIGATION_SETTINGS = 'Settings';
export const NAVIGATION_LOADING = 'Loading...';

// Welcome Screen
export const WELCOME_TITLE = 'Welcome to Julius';
export const WELCOME_DESCRIPTION = 'Hello, I am an intelligent and simplified app that helps you to keep on track of your spending with a configuration of a daily budget, and the record of your expenses as we go along.';
export const WELCOME_SET_BUDGET_BUTTON = 'I already have the daily budget ready';
export const WELCOME_HELP_BUTTON = 'Help me to set my daily budget';

// Settings Screen
export const SETTINGS_DARK_MODE_TITLE = 'Dark Mode';
export const SETTINGS_DARK_MODE_DESCRIPTION = 'Toggle between light and dark theme';
export const SETTINGS_LANGUAGE_TITLE = 'Language';
export const SETTINGS_LANGUAGE_DESCRIPTION = 'Change app language';
export const SETTINGS_LANGUAGE_ENGLISH = 'English';
export const SETTINGS_LANGUAGE_PORTUGUESE = 'Português';

// Set Budget Screen
export const SET_BUDGET_TITLE = 'Set Your Daily Budget';
export const SET_BUDGET_DESCRIPTION = 'Enter your daily budget amount and the hour of the day when it should be renewed. Optionally, you can set up a cycle for when you receive your income.';
export const SET_BUDGET_DAILY_BUDGET_LABEL = 'Daily Budget';
export const SET_BUDGET_RENEWAL_HOUR_LABEL = 'Renewal Hour (0-23)';
export const SET_BUDGET_CYCLE_SECTION_TITLE = 'Income Cycle (Optional)';
export const SET_BUDGET_CYCLE_FREQUENCY_LABEL = 'Cycle Frequency';
export const SET_BUDGET_NO_CYCLE = 'No cycle';
export const SET_BUDGET_DAY_OF_WEEK_LABEL = 'Day of Week';
export const SET_BUDGET_SELECT_DAY_OF_WEEK = 'Select day of week';
export const SET_BUDGET_ERROR_INVALID_BUDGET = 'Please enter a valid budget amount';
export const SET_BUDGET_ERROR_INVALID_HOUR = 'Please enter a valid hour (0-23)';
export const SET_BUDGET_ERROR_INVALID_DAY = 'Please select a valid renewal day';
export const SET_BUDGET_ERROR_INVALID_WEEK_DAY = 'Please select a valid day of the week';
export const SET_BUDGET_ERROR_INVALID_MONTH_DAY = 'Month day must be between 1 and 31';
export const SET_BUDGET_ERROR_INVALID_YEAR_DAY = 'Day must be between 1 and 31';
export const SET_BUDGET_ERROR_INVALID_MONTH = 'Month must be between 1 and 12';
export const SET_BUDGET_ERROR_SAVE_FAILED = 'Failed to save budget configuration. Please try again.';
export const SET_BUDGET_CONTINUE_BUTTON = 'Continue';
export const SET_BUDGET_BACK_BUTTON = 'Back';

// Budget Confirmation Screen
export const BUDGET_CONFIRMATION_TITLE = 'Confirm Your Budget';
export const BUDGET_CONFIRMATION_DESCRIPTION = 'We recommend a daily budget of $%s. You can adjust this amount downward if you\'d like.';
export const BUDGET_CONFIRMATION_DAILY_BUDGET_LABEL = 'Daily Budget';
export const BUDGET_CONFIRMATION_RENEWAL_HOUR_LABEL = 'Renewal Hour (0-23)';
export const BUDGET_CONFIRMATION_DAY_OF_WEEK_LABEL = 'Day of Week';
export const BUDGET_CONFIRMATION_DAY_OF_MONTH_LABEL = 'Day of Month (1-31)';
export const BUDGET_CONFIRMATION_DAY_OF_YEAR_LABEL = 'Day of Year (1-365)';
export const BUDGET_CONFIRMATION_MONTH_LABEL = 'Month (1-12)';

// Budget Amount Screen
export const BUDGET_AMOUNT_TITLE = 'Income Details';
export const BUDGET_AMOUNT_DESCRIPTION = 'Please enter your financial information per %s.';
export const BUDGET_AMOUNT_INCOME_LABEL = 'Income per %s';
export const BUDGET_AMOUNT_FIXED_EXPENSES_LABEL = 'Fixed Expenses';
export const BUDGET_AMOUNT_TARGET_SAVINGS_LABEL = 'Target Savings';

// Configure Cycle Screen
export const CONFIGURE_CYCLE_TITLE = 'Configure Budget Cycle';
export const CONFIGURE_CYCLE_DESCRIPTION = 'Set up how often your budget renews and when.';
export const CONFIGURE_CYCLE_FREQUENCY_LABEL = 'Cycle Frequency';
export const CONFIGURE_CYCLE_DAY_OF_WEEK_LABEL = 'Day of Week';
export const CONFIGURE_CYCLE_DAY_OF_MONTH_LABEL = 'Day of Month';

// Edit Budget Screen
export const EDIT_BUDGET_TITLE = 'Edit Budget';
export const EDIT_BUDGET_DESCRIPTION = 'Update your daily budget amount and renewal hour.';
export const EDIT_BUDGET_DAILY_AMOUNT_LABEL = 'Daily Budget Amount';
export const EDIT_BUDGET_RENEWAL_HOUR_LABEL = 'Daily Renewal Hour (0-23)';

// Main Screen
export const MAIN_DAILY_BUDGET_LABEL = 'Your current daily budget is';
export const MAIN_BALANCE_LABEL = 'Balance';
export const MAIN_SPENT_TODAY_LABEL = 'Spent Today';
export const MAIN_MAX_SPENDING_LABEL = '$%s maximum spending per day until next payment';
export const MAIN_ADD_EXPENSE_BUTTON = 'Add Expense';

// Main Chart
export const MAIN_CHART_TITLE = 'Spending Overview';
export const MAIN_CHART_DAY_LABEL = 'Day';
export const MAIN_CHART_WEEK_LABEL = 'Week';
export const MAIN_CHART_MONTH_LABEL = 'Month';

// Common
export const COMMON_ENTER_AMOUNT_PLACEHOLDER = 'Enter amount';
export const COMMON_ENTER_HOUR_PLACEHOLDER = 'Enter hour';
export const COMMON_ENTER_DAY_PLACEHOLDER = 'Enter day';
export const COMMON_RETRY_BUTTON = 'Retry';
export const COMMON_SET_UP_BUDGET_BUTTON = 'Set Up Budget';
export const COMMON_NO_USER_DATA_MESSAGE = 'No user data found. Please set up your budget.';

// Add Expense Screen
export const ADD_EXPENSE_TITLE = 'Add Expense';
export const ADD_EXPENSE_AMOUNT_LABEL = 'Amount';
export const ADD_EXPENSE_DESCRIPTION_LABEL = 'Description (optional)';
export const ADD_EXPENSE_BUTTON = 'Add Expense';
export const ADD_EXPENSE_CANCEL_BUTTON = 'Cancel';
export const ADD_EXPENSE_ERROR_INVALID_AMOUNT = 'Please enter a valid amount';
export const ADD_EXPENSE_ERROR_USER_NOT_FOUND = 'User not found';
export const ADD_EXPENSE_ERROR_FAILED = 'Failed to add expense';
export const ADD_EXPENSE_DEFAULT_DESCRIPTION = 'Unnamed Expense';

// Add Income Screen
export const ADD_INCOME_TITLE = 'Add Income';
export const ADD_INCOME_AMOUNT_LABEL = 'Amount';
export const ADD_INCOME_DESCRIPTION_LABEL = 'Description (optional)';
export const ADD_INCOME_BUTTON = 'Add Income';
export const ADD_INCOME_CANCEL_BUTTON = 'Cancel';
export const ADD_INCOME_ERROR_INVALID_AMOUNT = 'Please enter a valid amount';
export const ADD_INCOME_ERROR_USER_NOT_FOUND = 'User not found';
export const ADD_INCOME_ERROR_FAILED = 'Failed to add income';
export const ADD_INCOME_DEFAULT_DESCRIPTION = 'Unnamed Income';

// Budget Help Screen
export const BUDGET_HELP_TITLE = "Let's Set Your Budget";
export const BUDGET_HELP_DESCRIPTION = "First, tell us how often you get paid. This will help us calculate the best daily budget for you.";
export const BUDGET_HELP_DAILY_BUTTON = "Daily";
export const BUDGET_HELP_WEEKLY_BUTTON = "Weekly";
export const BUDGET_HELP_MONTHLY_BUTTON = "Monthly";
export const BUDGET_HELP_YEARLY_BUTTON = "Yearly";
export const BUDGET_HELP_BACK_BUTTON = "Back";

// Expense Details Screen
export const EXPENSE_DETAILS_TITLE = 'Expense Details';
export const EXPENSE_DETAILS_AMOUNT_LABEL = 'Amount';
export const EXPENSE_DETAILS_DESCRIPTION_LABEL = 'Description';
export const EXPENSE_DETAILS_DATE_LABEL = 'Date';
export const EXPENSE_DETAILS_CATEGORY_LABEL = 'Category';
export const EXPENSE_DETAILS_ITEMS_LABEL = 'Items';
export const EXPENSE_DETAILS_LOADING = 'Loading...';
export const EXPENSE_DETAILS_ERROR_NOT_FOUND = 'Expense not found';
export const EXPENSE_DETAILS_ERROR_LOAD_FAILED = 'Failed to load expense details';
export const EXPENSE_DETAILS_BACK_BUTTON = 'Back to History';
export const EXPENSE_DETAILS_GO_BACK_BUTTON = 'Go Back';

// History Screen
export const HISTORY_LOADING = 'Loading...';
export const HISTORY_ERROR_USER_NOT_FOUND = 'User not found';
export const HISTORY_ERROR_LOAD_FAILED = 'Failed to load transactions';
export const HISTORY_NO_TRANSACTIONS = 'No transactions found';
export const HISTORY_RETRY_BUTTON = 'Retry'; 