import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Table, Statistic, Space } from "antd";
import {
  fetchIncomeData,
  fetchExpensesData,
  fetchSavingsData,
} from "../store/action";
import { getIncome, getTotalExpense, getTotalSavings,auth,firestore} from "../firebase";
import { query, where, updateDoc } from 'firebase/firestore';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useDispatch } from "react-redux";

const DashboardTable = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const dispatch = useDispatch();

  

  const fetchIncomeData = useCallback(async () => {
    try {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          getAndSetIncomeData(user.uid);
        } else {
          console.error("User is not signed in");
          setIncomeData([]);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  }, []);

  const getAndSetIncomeData = async (userId) => {
    try {
      const incomeSnapshot = await getDocs(
        query(
          collection(firestore, 'income'),
          where('uid', '==', userId)
        )
      );

      const incomeData = incomeSnapshot.docs.map((doc) => doc.data());
      setIncomeData(incomeData);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          await fetchIncomeData(currentUser.uid);
        } else {
          console.error("User is not signed in");
          setIncomeData([]);
        }
      } catch (error) {
        console.error("Error checking user authentication:", error);
      }
    };

    fetchData();
  }, [fetchIncomeData]); // Include fetchIncomeData in the dependency array

  useEffect(() => {
    const processData = async () => {
      try {
        if (incomeData.length) {
          const groupedData = incomeData.reduce((acc, entry) => {
            const monthYear = new Date(entry.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
            });

            if (!acc[monthYear]) {
              acc[monthYear] = {
                date: monthYear,
                incomeAmount: 0,
                expenseAmount: 0,
                savingsAmount: 0,
              };
            }

            acc[monthYear].incomeAmount += entry.amount;
            return acc;
          }, {});
          const currentUser = auth.currentUser;
          const combinedData = await Promise.all(
            Object.values(groupedData).map(async (record) => {
              const totalExpense = await getTotalExpense(record.date, currentUser.uid);
              const totalSavings = await getTotalSavings(record.date, currentUser.uid);

              return {
                ...record,
                expenseAmount: totalExpense,
                savingsAmount: totalSavings,
              };
            })
          );

          setDashboardData(combinedData);
        }
      } catch (error) {
        console.error("Error processing data:", error);
      }
    };

    processData();
  }, [incomeData, fetchIncomeData]);
  const columns = [
    {
      title: <h3>Data</h3>,
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <Space direction="vertical">
          <div className="data-container">
            <div className="date-container">
              <strong>Date: </strong>
              {record.date ? (
                <div>
                  {(() => {
                    const [month, year] = record.date.split("/");
                    const formattedDate = new Date(
                      year,
                      parseInt(month, 10) - 1
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    });
                    return formattedDate;
                  })()}
                </div>
              ) : (
                "N/A"
              )}
            </div>
            <div>
              <strong>Total Income: </strong>
              <Statistic value={record.incomeAmount} precision={2} />
            </div>
            <div>
              <strong>Total Expense: </strong>
              <Statistic value={record.expenseAmount} precision={2} />
            </div>
            <div>
              <strong>Total Savings: </strong>
              <Statistic value={record.savingsAmount} precision={2} />
            </div>
          </div>
        </Space>
      ),
      responsive: ["xs"],
    },

    {
      title: <h3>Date</h3>,
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (date) {
          const [month, year] = date.split("/");
          const formattedDate = new Date(
            year,
            parseInt(month, 10) - 1
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          });
          console.log("Formatted Date:", formattedDate);
          return formattedDate;
        }
        return null;
      },
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: <h3>Total Income</h3>,
      dataIndex: "incomeAmount",
      key: "incomeAmount",
      render: (incomeAmount) => (
        <Statistic value={incomeAmount} precision={2} />
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: <h3>Total Expense</h3>,
      dataIndex: "expenseAmount",
      key: "expenseAmount",
      render: (expenseAmount) => (
        <Statistic value={expenseAmount} precision={2} />
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: <h3>Total Savings</h3>,
      dataIndex: "savingsAmount",
      key: "savingsAmount",
      render: (savingsAmount) => (
        <Statistic value={savingsAmount} precision={2} />
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
  ];

  console.log("dashboard data:", dashboardData);

  return (
    <div >
      <Table  columns={columns} dataSource={dashboardData} pagination={false}  className="over-flow-x"/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incomeData: state.income.data,
  savingsData: state.savings,
  expenseData: state.expenses,
});

const mapDispatchToProps = {
  fetchIncomeData,
  fetchExpensesData,
  fetchSavingsData,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardTable);
