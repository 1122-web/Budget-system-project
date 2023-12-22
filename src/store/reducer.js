// reducers.js


// reducers.js
import { 
  ADD_INCOME, ADD_EXPENSE, ADD_SAVING,SET_INCOME,
  SET_EXPENSES,SET_SAVINGS,UPDATE_INCOME_DATA,
  } from "./types";

// const initialState = {
//   income: {
//     data: [],
//   },
//   expenses: [], // Instead of expenses: [],
//   savings: [],
//   // income: [],
//   incomeData: [],
//   expenseData: [],
//   savingsData: [],
// };
const initialState = {
  income: {
    data: [],
  },
  expenses: {
    data: [],
  },
  savings: {
    data: [],
  },
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
 

  // case ADD_INCOME:
  //   return {
  //     ...state,
  //     income: {
  //       ...state.income,
  //       data: [...state.income.data, action.payload],
  //     },
  //   };

  case SET_INCOME:
    return {
      ...state,
      income: {
        ...state.income,
        data: action.payload, // spread the income data to create a new reference
      },
    };

    // return {
    //   ...state,
    //   income: action.payload,
    // };


  case SET_EXPENSES:
    return {
      ...state,
      expenses: action.payload,
    };

  case SET_SAVINGS:
    return {
      ...state,
      savings: action.payload,
    };    

    default:
      return state;

case UPDATE_INCOME_DATA:
  return {
    ...state,
    income: {
      ...state.income,
      data: action.payload,
    },
  };
}

};
export default reducer;




