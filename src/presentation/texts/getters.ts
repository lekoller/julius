import * as en from './english';
import * as pt from './portuguese';

export type Language = 'en' | 'pt';

// Navigation
export const getNavigationHistory = (language: Language) => 
  language === 'en' ? en.NAVIGATION_HISTORY : pt.NAVIGATION_HISTORY;

export const getNavigationChangeCycle = (language: Language) => 
  language === 'en' ? en.NAVIGATION_CHANGE_CYCLE : pt.NAVIGATION_CHANGE_CYCLE;

export const getNavigationEditBudget = (language: Language) => 
  language === 'en' ? en.NAVIGATION_EDIT_BUDGET : pt.NAVIGATION_EDIT_BUDGET;

export const getNavigationSettings = (language: Language) => 
  language === 'en' ? en.NAVIGATION_SETTINGS : pt.NAVIGATION_SETTINGS;

export const getNavigationLoading = (language: Language) => 
  language === 'en' ? en.NAVIGATION_LOADING : pt.NAVIGATION_LOADING;

// Welcome Screen
export const getWelcomeTitle = (language: Language) => 
  language === 'en' ? en.WELCOME_TITLE : pt.WELCOME_TITLE;

export const getWelcomeDescription = (language: Language) => 
  language === 'en' ? en.WELCOME_DESCRIPTION : pt.WELCOME_DESCRIPTION;

export const getWelcomeSetBudgetButton = (language: Language) => 
  language === 'en' ? en.WELCOME_SET_BUDGET_BUTTON : pt.WELCOME_SET_BUDGET_BUTTON;

export const getWelcomeHelpButton = (language: Language) => 
  language === 'en' ? en.WELCOME_HELP_BUTTON : pt.WELCOME_HELP_BUTTON;

// Settings Screen
export const getSettingsDarkModeTitle = (language: Language) => 
  language === 'en' ? en.SETTINGS_DARK_MODE_TITLE : pt.SETTINGS_DARK_MODE_TITLE;

export const getSettingsDarkModeDescription = (language: Language) => 
  language === 'en' ? en.SETTINGS_DARK_MODE_DESCRIPTION : pt.SETTINGS_DARK_MODE_DESCRIPTION;

export const getSettingsLanguageTitle = (language: Language) => 
  language === 'en' ? en.SETTINGS_LANGUAGE_TITLE : pt.SETTINGS_LANGUAGE_TITLE;

export const getSettingsLanguageDescription = (language: Language) => 
  language === 'en' ? en.SETTINGS_LANGUAGE_DESCRIPTION : pt.SETTINGS_LANGUAGE_DESCRIPTION;

export const getSettingsLanguageEnglish = (language: Language) => 
  language === 'en' ? en.SETTINGS_LANGUAGE_ENGLISH : pt.SETTINGS_LANGUAGE_ENGLISH;

export const getSettingsLanguagePortuguese = (language: Language) => 
  language === 'en' ? en.SETTINGS_LANGUAGE_PORTUGUESE : pt.SETTINGS_LANGUAGE_PORTUGUESE;

// Set Budget Screen
export const getSetBudgetTitle = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_TITLE : pt.SET_BUDGET_TITLE;

export const getSetBudgetDescription = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_DESCRIPTION : pt.SET_BUDGET_DESCRIPTION;

export const getSetBudgetDailyBudgetLabel = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_DAILY_BUDGET_LABEL : pt.SET_BUDGET_DAILY_BUDGET_LABEL;

export const getSetBudgetRenewalHourLabel = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_RENEWAL_HOUR_LABEL : pt.SET_BUDGET_RENEWAL_HOUR_LABEL;

export const getSetBudgetCycleSectionTitle = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_CYCLE_SECTION_TITLE : pt.SET_BUDGET_CYCLE_SECTION_TITLE;

export const getSetBudgetCycleFrequencyLabel = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_CYCLE_FREQUENCY_LABEL : pt.SET_BUDGET_CYCLE_FREQUENCY_LABEL;

export const getSetBudgetNoCycle = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_NO_CYCLE : pt.SET_BUDGET_NO_CYCLE;

export const getSetBudgetDayOfWeekLabel = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_DAY_OF_WEEK_LABEL : pt.SET_BUDGET_DAY_OF_WEEK_LABEL;

export const getSetBudgetSelectDayOfWeek = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_SELECT_DAY_OF_WEEK : pt.SET_BUDGET_SELECT_DAY_OF_WEEK;

export const getSetBudgetErrorInvalidBudget = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_ERROR_INVALID_BUDGET : pt.SET_BUDGET_ERROR_INVALID_BUDGET;

export const getSetBudgetErrorInvalidHour = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_ERROR_INVALID_HOUR : pt.SET_BUDGET_ERROR_INVALID_HOUR;

export const getSetBudgetErrorInvalidDay = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_ERROR_INVALID_DAY : pt.SET_BUDGET_ERROR_INVALID_DAY;

export const getSetBudgetErrorInvalidWeekDay = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_ERROR_INVALID_WEEK_DAY : pt.SET_BUDGET_ERROR_INVALID_WEEK_DAY;

export const getSetBudgetErrorInvalidMonthDay = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_ERROR_INVALID_MONTH_DAY : pt.SET_BUDGET_ERROR_INVALID_MONTH_DAY;

export const getSetBudgetErrorInvalidYearDay = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_ERROR_INVALID_YEAR_DAY : pt.SET_BUDGET_ERROR_INVALID_YEAR_DAY;

export const getSetBudgetErrorInvalidMonth = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_ERROR_INVALID_MONTH : pt.SET_BUDGET_ERROR_INVALID_MONTH;

export const getSetBudgetErrorSaveFailed = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_ERROR_SAVE_FAILED : pt.SET_BUDGET_ERROR_SAVE_FAILED;

export const getSetBudgetContinueButton = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_CONTINUE_BUTTON : pt.SET_BUDGET_CONTINUE_BUTTON;

export const getSetBudgetBackButton = (language: Language) => 
  language === 'en' ? en.SET_BUDGET_BACK_BUTTON : pt.SET_BUDGET_BACK_BUTTON;

// Budget Confirmation Screen
export const getBudgetConfirmationTitle = (language: Language) => 
  language === 'en' ? en.BUDGET_CONFIRMATION_TITLE : pt.BUDGET_CONFIRMATION_TITLE;

export const getBudgetConfirmationDescription = (language: Language) => 
  language === 'en' ? en.BUDGET_CONFIRMATION_DESCRIPTION : pt.BUDGET_CONFIRMATION_DESCRIPTION;

export const getBudgetConfirmationDailyBudgetLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_CONFIRMATION_DAILY_BUDGET_LABEL : pt.BUDGET_CONFIRMATION_DAILY_BUDGET_LABEL;

export const getBudgetConfirmationRenewalHourLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_CONFIRMATION_RENEWAL_HOUR_LABEL : pt.BUDGET_CONFIRMATION_RENEWAL_HOUR_LABEL;

export const getBudgetConfirmationDayOfWeekLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_CONFIRMATION_DAY_OF_WEEK_LABEL : pt.BUDGET_CONFIRMATION_DAY_OF_WEEK_LABEL;

export const getBudgetConfirmationDayOfMonthLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_CONFIRMATION_DAY_OF_MONTH_LABEL : pt.BUDGET_CONFIRMATION_DAY_OF_MONTH_LABEL;

export const getBudgetConfirmationDayOfYearLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_CONFIRMATION_DAY_OF_YEAR_LABEL : pt.BUDGET_CONFIRMATION_DAY_OF_YEAR_LABEL;

export const getBudgetConfirmationMonthLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_CONFIRMATION_MONTH_LABEL : pt.BUDGET_CONFIRMATION_MONTH_LABEL;

// Budget Amount Screen
export const getBudgetAmountTitle = (language: Language) => 
  language === 'en' ? en.BUDGET_AMOUNT_TITLE : pt.BUDGET_AMOUNT_TITLE;

export const getBudgetAmountDescription = (language: Language) => 
  language === 'en' ? en.BUDGET_AMOUNT_DESCRIPTION : pt.BUDGET_AMOUNT_DESCRIPTION;

export const getBudgetAmountIncomeLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_AMOUNT_INCOME_LABEL : pt.BUDGET_AMOUNT_INCOME_LABEL;

export const getBudgetAmountFixedExpensesLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_AMOUNT_FIXED_EXPENSES_LABEL : pt.BUDGET_AMOUNT_FIXED_EXPENSES_LABEL;

export const getBudgetAmountTargetSavingsLabel = (language: Language) => 
  language === 'en' ? en.BUDGET_AMOUNT_TARGET_SAVINGS_LABEL : pt.BUDGET_AMOUNT_TARGET_SAVINGS_LABEL;

// Configure Cycle Screen
export const getConfigureCycleTitle = (language: Language) => 
  language === 'en' ? en.CONFIGURE_CYCLE_TITLE : pt.CONFIGURE_CYCLE_TITLE;

export const getConfigureCycleDescription = (language: Language) => 
  language === 'en' ? en.CONFIGURE_CYCLE_DESCRIPTION : pt.CONFIGURE_CYCLE_DESCRIPTION;

export const getConfigureCycleFrequencyLabel = (language: Language) => 
  language === 'en' ? en.CONFIGURE_CYCLE_FREQUENCY_LABEL : pt.CONFIGURE_CYCLE_FREQUENCY_LABEL;

export const getConfigureCycleDayOfWeekLabel = (language: Language) => 
  language === 'en' ? en.CONFIGURE_CYCLE_DAY_OF_WEEK_LABEL : pt.CONFIGURE_CYCLE_DAY_OF_WEEK_LABEL;

export const getConfigureCycleDayOfMonthLabel = (language: Language) => 
  language === 'en' ? en.CONFIGURE_CYCLE_DAY_OF_MONTH_LABEL : pt.CONFIGURE_CYCLE_DAY_OF_MONTH_LABEL;

// Edit Budget Screen
export const getEditBudgetTitle = (language: Language) => 
  language === 'en' ? en.EDIT_BUDGET_TITLE : pt.EDIT_BUDGET_TITLE;

export const getEditBudgetDescription = (language: Language) => 
  language === 'en' ? en.EDIT_BUDGET_DESCRIPTION : pt.EDIT_BUDGET_DESCRIPTION;

export const getEditBudgetDailyAmountLabel = (language: Language) => 
  language === 'en' ? en.EDIT_BUDGET_DAILY_AMOUNT_LABEL : pt.EDIT_BUDGET_DAILY_AMOUNT_LABEL;

export const getEditBudgetRenewalHourLabel = (language: Language) => 
  language === 'en' ? en.EDIT_BUDGET_RENEWAL_HOUR_LABEL : pt.EDIT_BUDGET_RENEWAL_HOUR_LABEL;

// Main Screen
export const getMainDailyBudgetLabel = (language: Language) => 
  language === 'en' ? en.MAIN_DAILY_BUDGET_LABEL : pt.MAIN_DAILY_BUDGET_LABEL;

export const getMainBalanceLabel = (language: Language) => 
  language === 'en' ? en.MAIN_BALANCE_LABEL : pt.MAIN_BALANCE_LABEL;

export const getMainSpentTodayLabel = (language: Language) => 
  language === 'en' ? en.MAIN_SPENT_TODAY_LABEL : pt.MAIN_SPENT_TODAY_LABEL;

export const getMainMaxSpendingLabel = (language: Language) => 
  language === 'en' ? en.MAIN_MAX_SPENDING_LABEL : pt.MAIN_MAX_SPENDING_LABEL;

export const getMainAddExpenseButton = (language: Language) => 
  language === 'en' ? en.MAIN_ADD_EXPENSE_BUTTON : pt.MAIN_ADD_EXPENSE_BUTTON;

// Main Chart
export const getMainChartTitle = (language: Language) => 
  language === 'en' ? en.MAIN_CHART_TITLE : pt.MAIN_CHART_TITLE;

export const getMainChartDayLabel = (language: Language) => 
  language === 'en' ? en.MAIN_CHART_DAY_LABEL : pt.MAIN_CHART_DAY_LABEL;

export const getMainChartWeekLabel = (language: Language) => 
  language === 'en' ? en.MAIN_CHART_WEEK_LABEL : pt.MAIN_CHART_WEEK_LABEL;

export const getMainChartMonthLabel = (language: Language) => 
  language === 'en' ? en.MAIN_CHART_MONTH_LABEL : pt.MAIN_CHART_MONTH_LABEL;

// Common
export const getCommonEnterAmountPlaceholder = (language: Language) => 
  language === 'en' ? en.COMMON_ENTER_AMOUNT_PLACEHOLDER : pt.COMMON_ENTER_AMOUNT_PLACEHOLDER;

export const getCommonEnterHourPlaceholder = (language: Language) => 
  language === 'en' ? en.COMMON_ENTER_HOUR_PLACEHOLDER : pt.COMMON_ENTER_HOUR_PLACEHOLDER;

export const getCommonEnterDayPlaceholder = (language: Language) => 
  language === 'en' ? en.COMMON_ENTER_DAY_PLACEHOLDER : pt.COMMON_ENTER_DAY_PLACEHOLDER;

export const getCommonRetryButton = (language: Language) => 
  language === 'en' ? en.COMMON_RETRY_BUTTON : pt.COMMON_RETRY_BUTTON;

export const getCommonSetUpBudgetButton = (language: Language) => 
  language === 'en' ? en.COMMON_SET_UP_BUDGET_BUTTON : pt.COMMON_SET_UP_BUDGET_BUTTON;

export const getCommonNoUserDataMessage = (language: Language) => 
  language === 'en' ? en.COMMON_NO_USER_DATA_MESSAGE : pt.COMMON_NO_USER_DATA_MESSAGE;

// Add Expense Screen
export const getAddExpenseTitle = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_TITLE : pt.ADD_EXPENSE_TITLE;

export const getAddExpenseAmountLabel = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_AMOUNT_LABEL : pt.ADD_EXPENSE_AMOUNT_LABEL;

export const getAddExpenseDescriptionLabel = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_DESCRIPTION_LABEL : pt.ADD_EXPENSE_DESCRIPTION_LABEL;

export const getAddExpenseButton = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_BUTTON : pt.ADD_EXPENSE_BUTTON;

export const getAddExpenseCancelButton = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_CANCEL_BUTTON : pt.ADD_EXPENSE_CANCEL_BUTTON;

export const getAddExpenseErrorInvalidAmount = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_ERROR_INVALID_AMOUNT : pt.ADD_EXPENSE_ERROR_INVALID_AMOUNT;

export const getAddExpenseErrorUserNotFound = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_ERROR_USER_NOT_FOUND : pt.ADD_EXPENSE_ERROR_USER_NOT_FOUND;

export const getAddExpenseErrorFailed = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_ERROR_FAILED : pt.ADD_EXPENSE_ERROR_FAILED;

export const getAddExpenseDefaultDescription = (language: Language) => 
  language === 'en' ? en.ADD_EXPENSE_DEFAULT_DESCRIPTION : pt.ADD_EXPENSE_DEFAULT_DESCRIPTION;

// Add Income Screen
export const getAddIncomeTitle = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_TITLE : pt.ADD_INCOME_TITLE;

export const getAddIncomeAmountLabel = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_AMOUNT_LABEL : pt.ADD_INCOME_AMOUNT_LABEL;

export const getAddIncomeDescriptionLabel = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_DESCRIPTION_LABEL : pt.ADD_INCOME_DESCRIPTION_LABEL;

export const getAddIncomeButton = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_BUTTON : pt.ADD_INCOME_BUTTON;

export const getAddIncomeCancelButton = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_CANCEL_BUTTON : pt.ADD_INCOME_CANCEL_BUTTON;

export const getAddIncomeErrorInvalidAmount = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_ERROR_INVALID_AMOUNT : pt.ADD_INCOME_ERROR_INVALID_AMOUNT;

export const getAddIncomeErrorUserNotFound = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_ERROR_USER_NOT_FOUND : pt.ADD_INCOME_ERROR_USER_NOT_FOUND;

export const getAddIncomeErrorFailed = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_ERROR_FAILED : pt.ADD_INCOME_ERROR_FAILED;

export const getAddIncomeDefaultDescription = (language: Language) => 
  language === 'en' ? en.ADD_INCOME_DEFAULT_DESCRIPTION : pt.ADD_INCOME_DEFAULT_DESCRIPTION;

// Budget Help Screen
export const getBudgetHelpTitle = (language: Language) => 
  language === 'en' ? en.BUDGET_HELP_TITLE : pt.BUDGET_HELP_TITLE;

export const getBudgetHelpDescription = (language: Language) => 
  language === 'en' ? en.BUDGET_HELP_DESCRIPTION : pt.BUDGET_HELP_DESCRIPTION;

export const getBudgetHelpDailyButton = (language: Language) => 
  language === 'en' ? en.BUDGET_HELP_DAILY_BUTTON : pt.BUDGET_HELP_DAILY_BUTTON;

export const getBudgetHelpWeeklyButton = (language: Language) => 
  language === 'en' ? en.BUDGET_HELP_WEEKLY_BUTTON : pt.BUDGET_HELP_WEEKLY_BUTTON;

export const getBudgetHelpMonthlyButton = (language: Language) => 
  language === 'en' ? en.BUDGET_HELP_MONTHLY_BUTTON : pt.BUDGET_HELP_MONTHLY_BUTTON;

export const getBudgetHelpYearlyButton = (language: Language) => 
  language === 'en' ? en.BUDGET_HELP_YEARLY_BUTTON : pt.BUDGET_HELP_YEARLY_BUTTON;

export const getBudgetHelpBackButton = (language: Language) => 
  language === 'en' ? en.BUDGET_HELP_BACK_BUTTON : pt.BUDGET_HELP_BACK_BUTTON;

// Expense Details Screen
export const getExpenseDetailsTitle = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_TITLE : pt.EXPENSE_DETAILS_TITLE;

export const getExpenseDetailsAmountLabel = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_AMOUNT_LABEL : pt.EXPENSE_DETAILS_AMOUNT_LABEL;

export const getExpenseDetailsDescriptionLabel = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_DESCRIPTION_LABEL : pt.EXPENSE_DETAILS_DESCRIPTION_LABEL;

export const getExpenseDetailsDateLabel = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_DATE_LABEL : pt.EXPENSE_DETAILS_DATE_LABEL;

export const getExpenseDetailsCategoryLabel = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_CATEGORY_LABEL : pt.EXPENSE_DETAILS_CATEGORY_LABEL;

export const getExpenseDetailsItemsLabel = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_ITEMS_LABEL : pt.EXPENSE_DETAILS_ITEMS_LABEL;

export const getExpenseDetailsLoading = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_LOADING : pt.EXPENSE_DETAILS_LOADING;

export const getExpenseDetailsErrorNotFound = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_ERROR_NOT_FOUND : pt.EXPENSE_DETAILS_ERROR_NOT_FOUND;

export const getExpenseDetailsErrorLoadFailed = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_ERROR_LOAD_FAILED : pt.EXPENSE_DETAILS_ERROR_LOAD_FAILED;

export const getExpenseDetailsBackButton = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_BACK_BUTTON : pt.EXPENSE_DETAILS_BACK_BUTTON;

export const getExpenseDetailsGoBackButton = (language: Language) => 
  language === 'en' ? en.EXPENSE_DETAILS_GO_BACK_BUTTON : pt.EXPENSE_DETAILS_GO_BACK_BUTTON;

// History Screen
export const getHistoryLoading = (language: Language) => 
  language === 'en' ? en.HISTORY_LOADING : pt.HISTORY_LOADING;

export const getHistoryErrorUserNotFound = (language: Language) => 
  language === 'en' ? en.HISTORY_ERROR_USER_NOT_FOUND : pt.HISTORY_ERROR_USER_NOT_FOUND;

export const getHistoryErrorLoadFailed = (language: Language) => 
  language === 'en' ? en.HISTORY_ERROR_LOAD_FAILED : pt.HISTORY_ERROR_LOAD_FAILED;

export const getHistoryNoTransactions = (language: Language) => 
  language === 'en' ? en.HISTORY_NO_TRANSACTIONS : pt.HISTORY_NO_TRANSACTIONS;

export const getHistoryRetryButton = (language: Language) => 
  language === 'en' ? en.HISTORY_RETRY_BUTTON : pt.HISTORY_RETRY_BUTTON;
