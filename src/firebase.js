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
export const getIncome = async () => {
  try {
  
    const snapshot = await getDocs(collection(firestore, 'income'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting income from Firestore:', error);
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
export const getExpenses = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'expense'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting expense from Firestore:', error);
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
export const getSavings = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'savings'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting savings from Firestore:', error);
    return [];
  }
};
export const getTotalIncome = async (date) => {
  try {
    console.log('Fetching total income for date:', date);

    const incomeSnapshot = await getDocs(collection(firestore, 'income'));

    // Extract the year and month from the provided date
    const providedYear = new Date(date).getFullYear();
    const providedMonth = new Date(date).getMonth() + 1;
    console.log(' inn Provided Year:', providedYear);
    console.log('inn Provided Month:', providedMonth);
    const totalIncome = incomeSnapshot.docs
      .filter((doc) => {
        const docYear = doc.data().month.year;
        const docMonth = doc.data().month.month;
        // Compare year and month
        return docYear === providedYear && docMonth === providedMonth;
      })
      .reduce((total, doc) => total + doc.data().amount, 0);

    console.log('Total Income:', totalIncome);

    return totalIncome;
  } catch (error) {
    console.error('Error getting total income from Firestore:', error);
    return 0;
  }
};

export const getTotalExpense = async (date) => {
  try {
    console.log('Fetching total expense for date:', date);

    // Split the date string into month and year
    const [month, year] = date.split('/');

    // Create a new Date object with the components
    const dateObject = new Date(`${month}/01/${year}`); // Assuming day is always 01

    // Check if the dateObject is valid
    if (isNaN(dateObject.getTime())) {
      console.error('Invalid date format:', date);
      return 0;
    }
    const expenseSnapshot = await getDocs(collection(firestore, 'expense'));
    // Extract the year and month from the date object
    const providedYear = dateObject.getFullYear();
    const providedMonth = dateObject.getMonth() + 1;
    // const expenseSnapshot = await getDocs(collection(firestore, 'expense'));
    // const providedYear = new Date(date).getFullYear();
    // const providedMonth = new Date(date).getMonth() + 1;
    console.log('Provided Year:', providedYear);
    console.log('Provided Month:', providedMonth);
    const totalExpense = expenseSnapshot.docs
      .filter((doc) => {
        const docYear = doc.data().month.year;
        const docMonth = doc.data().month.month;
        // Compare year and month
        return docYear === providedYear && docMonth === providedMonth;
      })
      .reduce((total, doc) => total + doc.data().amount, 0);


    console.log('Total Expense:', totalExpense);

    return totalExpense;
  } catch (error) {
    console.error('Error getting total expense from Firestore:', error);
    return 0;
  }
};

export const getTotalSavings = async (date) => {
  try {
    console.log('Fetching total expense for date:', date);

    // Split the date string into month and year
    const [month, year] = date.split('/');

    // Create a new Date object with the components
    const dateObject = new Date(`${month}/01/${year}`); // Assuming day is always 01

    // Check if the dateObject is valid
    if (isNaN(dateObject.getTime())) {
      console.error('Invalid date format:', date);
      return 0;
    }
    const savingsSnapshot = await getDocs(collection(firestore, 'savings'));
    // Extract the year and month from the date object
    const providedYear = dateObject.getFullYear();
    const providedMonth = dateObject.getMonth() + 1;
    // const expenseSnapshot = await getDocs(collection(firestore, 'expense'));
    // const providedYear = new Date(date).getFullYear();
    // const providedMonth = new Date(date).getMonth() + 1;
    console.log('Provided Year:', providedYear);
    console.log('Provided Month:', providedMonth);
    const totalSavings = savingsSnapshot.docs
      .filter((doc) => {
        const docYear = doc.data().month.year;
        const docMonth = doc.data().month.month;
        // Compare year and month
        return docYear === providedYear && docMonth === providedMonth;
      })
      .reduce((total, doc) => total + doc.data().amount, 0);


    // console.log('Total savings:', total);

    return totalSavings;
  } catch (error) {
    console.error('Error getting total savings from Firestore:', error);
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

