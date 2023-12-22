import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Table, Statistic, Space } from "antd";
import {
  fetchIncomeData,
  fetchExpensesData,
  fetchSavingsData,
} from "../store/action";
import { getIncome, getTotalExpense, getTotalSavings } from "../firebase";
import { useDispatch } from "react-redux";

const DashboardTable = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const dispatch = useDispatch();

  const fetchIncomeData = useCallback(async () => {
    try {
      // Use your existing function to fetch income data from Firebase
      const incomeFromFirestore = await getIncome();
      setIncomeData(incomeFromFirestore);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch income data if it's not available
        if (!incomeData.length) {
          await fetchIncomeData();
        }

        // Ensure that the incomeData is available
        if (incomeData.length) {
          // Group incomeData by month with a consistent date format
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

          console.log("Grouped Data:", groupedData);

          // Fetch and aggregate totalExpense and totalSavings for each month
          const combinedData = await Promise.all(
            Object.values(groupedData).map(async (record) => {
              console.log("Fetching data for record:", record);

              const totalExpense = await getTotalExpense(record.date);
              const totalSavings = await getTotalSavings(record.date);

              console.log("Fetched data for record:", record);

              return {
                ...record,
                expenseAmount: totalExpense,
                savingsAmount: totalSavings,
              };
            })
          );

          console.log("Combined Data:", combinedData);

          setDashboardData(combinedData);
          // await fetchIncomeData();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
