import { initializeApp } from 'firebase/app';
import { query, where, updateDoc } from 'firebase/firestore';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';

const firebaseConfig = {
  apiKey: "AIzaSyCyGlcZvdS2AB8cQCDusUr17IpV7jBaj00",
  authDomain: "budget-tracker-a57b0.firebaseapp.com",
  databaseURL: "https://budget-tracker-a57b0-default-rtdb.firebaseio.com",
  projectId: "budget-tracker-a57b0",
  storageBucket: "budget-tracker-a57b0.appspot.com",
  messagingSenderId: "604093918138",
  appId: "1:604093918138:web:3ea1dee01fd1ae06b2cb83",
  measurementId: "G-BGJR989K6D"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);



export const addIncome = async (incomeData) => {
  try {
    const { amount, date } = incomeData;

    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No user is currently signed in.");
      return;
    }

    // Check if there is an existing entry for the same date (optional)
    const existingIncomeSnapshot = await getDocs(
      query(
        collection(firestore, "income"),
        where("month.year", "==", new Date(date).getFullYear()),
        where("month.month", "==", new Date(date).getMonth() + 1),
        where("uid", "==", currentUser.uid)
      )
    );

    if (existingIncomeSnapshot.size > 0) {
      console.log("There is already an entry for the same date.");
      // You can choose to handle this situation if needed
    }

    // Add a new income entry
    await addDoc(collection(firestore, "income"), {
      amount,
      uid: currentUser.uid,
      month: {
        year: new Date(date).getFullYear(),
        month: new Date(date).getMonth() + 1,
      },
      date: incomeData.date || null,
    });

    console.log("Income added to Firestore");
  } catch (error) {
    console.error("Error adding income to Firestore:", error.message);
    throw error;
  }
};
// export const getIncome = async () => {
//   try {
  
//     const snapshot = await getDocs(collection(firestore, 'income'));
//     return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   } catch (error) {
//     console.error('Error getting income from Firestore:', error);
//     return [];
//   }
// };
export const getIncome = async (userId) => {
  try {
    const incomeSnapshot = await getDocs(
      query(
        collection(firestore, "income"),
        where("uid", "==", userId)
      )
    );

    const incomeData = incomeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return incomeData;
  } catch (error) {
    console.error("Error getting income data from Firestore:", error);
    return [];
  }
};
export const addExpense = async (expenseData) => {
  try {
    const { amount, date } = expenseData;
    const currentUser = auth.currentUser;

    // Fetch total income for the specified month
    const totalIncomeSnapshot = await getDocs(
      query(
        collection(firestore, "income"),
        where("month.year", "==", new Date(date).getFullYear()),
        where("month.month", "==", new Date(date).getMonth() + 1),
        where("uid", "==", currentUser.uid)
      )
    );
    const totalIncome = totalIncomeSnapshot.docs.reduce(
      (total, doc) => total + doc.data().amount,
      0
    );

    // Fetch total expense for the specified month
    const totalExpenseSnapshot = await getDocs(
      query(
        collection(firestore, "expense"),
        where("month.year", "==", new Date(date).getFullYear()),
        where("month.month", "==", new Date(date).getMonth() + 1),
        where("uid", "==", currentUser.uid)
      )
    );
    const totalExpense = totalExpenseSnapshot.docs.reduce(
      (total, doc) => total + doc.data().amount,
      0
    );

    console.log("Total Income:", totalIncome);
    console.log("Total Expense:", totalExpense);
    console.log("New Expense Amount:", amount);

    if (!totalIncome) {
      toast.error("First add income for this month", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#e4f0f0",
          marginTop: 50,
        },
      });
      return;
    }

    if (totalExpense + amount > totalIncome) {
      toast.error(
        "Total expense cannot be greater than total income for this month",
        {
          position: toast.POSITION.TOP_RIGHT,
          style: {
            background: "#e4f0f0",
            marginTop: 50,
          },
        }
      );
      return;
    }

    // Add a new expense entry
    await addDoc(collection(firestore, "expense"), {
      amount,
      uid: currentUser.uid,
      month: {
        year: new Date(date).getFullYear(),
        month: new Date(date).getMonth() + 1,
      },
      date: expenseData.date || null,
    });

    console.log("Expense added to Firestore");
  } catch (error) {
    console.error("Error adding/updating expense to Firestore:", error.message);
    throw error;
  }
};

// Get Expense
// export const getExpenses = async () => {
//   try {
//     const snapshot = await getDocs(collection(firestore, 'expense'));
//     return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   } catch (error) {
//     console.error('Error getting expense from Firestore:', error);
//     return [];
//   }
// };
export const getExpenses = async (userId) => {
  try {
    const expensesSnapshot = await getDocs(
      query(
        collection(firestore, "expense"),
        where("uid", "==", userId)
      )
    );

    const expensesData = expensesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return expensesData;
  } catch (error) {
    console.error("Error getting expenses data from Firestore:", error);
    return [];
  }
};
export const addSavings = async (savingsData) => {
  try {
    const { amount, date } = savingsData;

    // Format the savings date to match the month/year format
    const savingsMonthYear = format(new Date(date), "yyyy-MM");

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is currently signed in.");
      return [];
    }

    // Fetch total income for the specified month
    const totalIncomeSnapshot = await getDocs(
      query(
        collection(firestore, "income"),
        where("month.year", "==", new Date(date).getFullYear()),
        where("month.month", "==", new Date(date).getMonth() + 1),
        where("uid", "==", currentUser.uid)
      )
    );
    const totalIncome = totalIncomeSnapshot.docs.reduce(
      (total, doc) => total + doc.data().amount,
      0
    );

    // Fetch total expense for the specified month
    const expenseSnapshot = await getDocs(
      query(
        collection(firestore, "expense"),
        where("month.year", "==", new Date(date).getFullYear()),
        where("month.month", "==", new Date(date).getMonth() + 1),
        where("uid", "==", currentUser.uid)
      )
    );
    const totalExpense = expenseSnapshot.docs.reduce(
      (total, doc) => total + doc.data().amount,
      0
    );

    // Fetch total savings for the specified month
    const savingsSnapshot = await getDocs(
      query(
        collection(firestore, "savings"),
        where("month.year", "==", new Date(date).getFullYear()),
        where("month.month", "==", new Date(date).getMonth() + 1),
        where("uid", "==", currentUser.uid)
      )
    );
    const totalSavings = savingsSnapshot.docs.reduce(
      (total, doc) => total + doc.data().amount,
      0
    );

    console.log("Total Income:", totalIncome);
    console.log("Total Expense:", totalExpense);
    console.log("Total Savings:", totalSavings);
    console.log("New Savings Amount:", amount);

    if (!totalIncome) {
      toast.error("First add income for this month", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#e4f0f0",
          marginTop: 50,
        },
      });
      return;
    }

    // Check if total savings are greater than the difference between total income and total expense
    if (totalSavings + amount > totalIncome - totalExpense) {
      toast.error(
        "Total savings cannot be greater than total income minus total expense for this month",
        {
          position: toast.POSITION.TOP_RIGHT,
          style: {
            background: "#e4f0f0",
            marginTop: 50,
          },
        }
      );
      return;
    }
  // Add a new expense entry
  await addDoc(collection(firestore, "savings"), {
    amount,
    uid: currentUser.uid,
    month: {
      year: new Date(date).getFullYear(),
      month: new Date(date).getMonth() + 1,
    },
    date: savingsData.date || null,
  });

  console.log("Expense added to Firestore");
} catch (error) {
  console.error("Error adding/updating expense to Firestore:", error.message);
  throw error;
}
};

export const getSavings = async (userId) => {
  try {
    const savingsSnapshot = await getDocs(
      query(
        collection(firestore, "savings"),
        where("uid", "==", userId)
      )
    );

    const savingsData = savingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return savingsData;
  } catch (error) {
    console.error("Error getting savings data from Firestore:", error);
    return [];
  }
};

export const getTotalIncome = async (date, userId) => {
  try {
    console.log('Fetching total income for date and user:', date, userId);

    // Split the date string into month and year
    const [month, year] = date.split("/");

    // Create a new Date object with the components
    const dateObject = new Date(`${month}/01/${year}`); // Assuming day is always 01

    // Check if the dateObject is valid
    if (isNaN(dateObject.getTime())) {
      console.error('Invalid date format:', date);
      return 0;
    }

    // Construct a Firestore query to get income for the specified user, year, and month
    const incomeQuery = query(
      collection(firestore, 'income'),
      where('uid', '==', userId), // Adjust the field name if necessary
      where('month.month', '==', dateObject.getMonth() + 1),
      where('month.year', '==', dateObject.getFullYear())
    );

    // Execute the query and get the documents
    const incomeSnapshot = await getDocs(incomeQuery);

    // Calculate the total income from the documents
    const totalIncome = incomeSnapshot.docs.reduce(
      (total, doc) => total + doc.data().amount,
      0
    );

    console.log('Filtered documents:', incomeSnapshot.docs.map(doc => doc.data()));
    console.log('Total Income:', totalIncome);

    return totalIncome;
  } catch (error) {
    console.error('Error getting total income from Firestore:', error);
    return 0;
  }
};
export const getTotalExpense = async (date, userId) => {
  try {
    console.log("Fetching total expense for date and user:", date, userId);

    // Split the date string into month and year
    const [month, year] = date.split("/");

    // Create a new Date object with the components
    const dateObject = new Date(`${month}/01/${year}`); // Assuming day is always 01

    // Check if the dateObject is valid
    if (isNaN(dateObject.getTime())) {
      console.error("Invalid date format:", date);
      return 0;
    }

    // Construct a Firestore query to get expenses for the specified user, year, and month
    const expenseQuery = query(
      collection(firestore, "expense"),
      where("uid", "==", userId), // Adjust the field name if necessary
      where("month.month", "==", dateObject.getMonth() + 1),
      where("month.year", "==", dateObject.getFullYear())
    );

    // Execute the query and get the documents
    const expenseSnapshot = await getDocs(expenseQuery);

    // Calculate the total expense from the documents
    const totalExpense = expenseSnapshot.docs.reduce(
      (total, doc) => total + doc.data().amount,
      0
    );

    console.log("Filtered documents:", expenseSnapshot.docs.map(doc => doc.data()));
    console.log("Total Expense:", totalExpense);

    return totalExpense;
  } catch (error) {
    console.error("Error getting total expense from Firestore:", error);
    return 0;
  }
};
export const getTotalSavings = async (date, userId) => {
  try {
    console.log("Fetching total savings for date and user:", date, userId);

    // Split the date string into month and year
    const [month, year] = date.split("/");

    // Create a new Date object with the components
    const dateObject = new Date(`${month}/01/${year}`); // Assuming day is always 01

    // Check if the dateObject is valid
    if (isNaN(dateObject.getTime())) {
      console.error("Invalid date format:", date);
      return 0;
    }

    // Construct a Firestore query to get savings for the specified user, year, and month
    const savingsQuery = query(
      collection(firestore, "savings"),
      where("uid", "==", userId), // Adjust the field name if necessary
      where("month.month", "==", dateObject.getMonth() + 1),
      where("month.year", "==", dateObject.getFullYear())
    );

    // Execute the query and get the documents
    const savingsSnapshot = await getDocs(savingsQuery);

    // Calculate the total savings from the documents
    const totalSavings = savingsSnapshot.docs.reduce(
      (total, doc) => total + doc.data().amount,
      0
    );

    console.log("Filtered documents:", savingsSnapshot.docs.map(doc => doc.data()));
    console.log("Total Savings:", totalSavings);

    return totalSavings;
  } catch (error) {
    console.error("Error getting total savings from Firestore:", error);
    return 0;
  }
};

export const deleteIncomeRecord = async (incomeId) => {
  try {
    await deleteDoc(doc(firestore, 'income', incomeId));
    console.log('Income record deleted from Firestore');
  } catch (error) {
    console.error('Error deleting income record from Firestore:', error);
    throw error;
  }
};

export const deleteExpenseRecord = async (expenseId) => {
  try {
    await deleteDoc(doc(firestore, 'expense', expenseId));
    console.log('expense record deleted from Firestore');
  } catch (error) {
    console.error('Error deleting expense record from Firestore:', error);
    throw error;
  }
};

export const deleteSavingRecord = async (savingsId) => {
  try {
    await deleteDoc(doc(firestore, 'savings', savingsId));
    console.log('savings record deleted from Firestore');
  } catch (error) {
    console.error('Error deleting savings record from Firestore:', error);
    throw error;
  }
};






export { app, firestore, serverTimestamp,googleProvider , auth };

