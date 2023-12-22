




import { ADD_INCOME, ADD_EXPENSE, ADD_SAVING,SET_INCOME,
  SET_EXPENSES,SET_SAVINGS,UPDATE_INCOME_DATA ,
  UPDATE_EXPENSE_DATA,UPDATE_SAVING_DATA} 
  from "./types";
import { getIncome, getExpenses, getSavings } from "../firebase";






// incomeActions.js
export const addIncomeAction = ( income) => ({
    type: ADD_INCOME,
    payload: income
    // payload: { amount, date },
  });
// expenseActions.js
export const addExpenseAction= (amount) => ({
    type: ADD_EXPENSE,
    payload: amount,
    // payload: { amount, date },
  });
// savingsActions.js
export const addSavingAction= (amount) => ({
    type: ADD_SAVING,
    payload: amount,
    // payload: { amount},
  });  
  

  // export const setIncomeAction = (income) => ({
  //   type: SET_INCOME,
  //   payload: income,
  // });
  // actions.js
export const setIncomeAction = (income) => ({
  type: SET_INCOME,
  payload: income, // Create a new reference for the income data
});
  export const setExpensesAction = (expenses) => ({
    type: SET_EXPENSES,
    payload: expenses,
  });
  
  export const setSavingsAction = (savings) => ({
    type: SET_SAVINGS,
    payload: savings,
  });

  export const updateIncomeData = (updatedData) => ({
    type: UPDATE_INCOME_DATA,
    payload: updatedData,
  });
  export const fetchIncomeData = (date) => async (dispatch) => {
    try {
      console.log('Fetching income data...');
      const incomeData = await getIncome(date); // Replace with your fetching logic
      console.log('Income data received:', incomeData);
      dispatch(setIncomeAction(incomeData));
      // dispatch(updateIncomeData(fetchIncomeData));
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  };
  
  export const fetchExpensesData = (date) => async (dispatch) => {
    try {
      console.log('Fetching expenses data for date:', date);
      const expensesData = await getExpenses(date); // Adjust getExpenses to take a date parameter
      console.log('Expenses data received:', expensesData);
      dispatch(setExpensesAction(expensesData));
    } catch (error) {
      console.error('Error fetching expenses data:', error);
    }
  };
  
  export const fetchSavingsData = (date) => async (dispatch) => {
    try {
      console.log('Fetching savings data for date:', date);
      const savingsData = await getSavings(date); // Adjust getSavings to take a date parameter
      console.log('Savings data received:', savingsData);
      dispatch(setSavingsAction(savingsData));
    } catch (error) {
      console.error('Error fetching savings data:', error);
    }
  };