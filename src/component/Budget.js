

import React, { useEffect, useState ,useCallback} from 'react';
import { connect } from 'react-redux';
import { Card,Col,Row, Statistic, Space } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { fetchIncomeData } from '../store/action';
import { getIncome, getExpenses, getSavings } from '../firebase';


const Budget = () => {
    const [pieChartData, setPieChartData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  // const [expenseData, setExpenseData] = useState([]);
  // const [savingData, setSavingsData] = useState([]);
  

  const fetchIncomeData = useCallback(async () => {
    try {
      const incomeFromFirestore = await getIncome();
      setIncomeData(incomeFromFirestore);
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  }, [getIncome]);

  const getTotalExpense = useCallback(async (date) => {
    try {
      const expenseFromFirestore = await getExpenses();
      // Process and return total expense for the specified date
      return expenseFromFirestore.reduce((total, expense) => total + expense.amount, 0);
    } catch (error) {
      console.error('Error fetching expense data:', error);
      return 0;
    }
  }, [getExpenses]);

  const getTotalSavings = useCallback(async (date) => {
    try {
      const savingsFromFirestore = await getSavings();
      // Process and return total savings for the specified date
      return savingsFromFirestore.reduce((total, saving) => total + saving.amount, 0);
    } catch (error) {
      console.error('Error fetching savings data:', error);
      return 0;
    }
  }, [getSavings]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!incomeData.length) {
          await fetchIncomeData();
        }

        if (incomeData.length) {
          const groupedData = incomeData.reduce((acc, entry) => {
            const monthYear = new Date(entry.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'numeric',
            });
            if (!acc[monthYear]) {
              acc[monthYear] = {
                date: monthYear,
                totalIncome: 0,
                totalExpense: 0,
                totalSavings: 0,
              };
            }

            acc[monthYear].totalIncome += entry.amount;

            return acc;
          }, {});

          const combinedData = await Promise.all(
            Object.values(groupedData).map(async (record) => {
              const totalExpense = await getTotalExpense(record.date);
              const totalSavings = await getTotalSavings(record.date);

              return {
                ...record,
                totalExpense,
                totalSavings,
              };
            })
          );

          const chartDataArray = combinedData.map((chartData) => ({
            date: chartData.date,
            data: {
              labels: ['Income', 'Expense', 'Savings'],
              datasets: [
                {
                  data: [chartData.totalIncome, chartData.totalExpense, chartData.totalSavings],
                  backgroundColor: ['#2ecc71', '#e74c3c', '#3498db'],
                },
              ],
            },
          }));

          setPieChartData(chartDataArray);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [incomeData, fetchIncomeData, getTotalExpense, getTotalSavings]);
  return (
    <div>
    {pieChartData.map((chartData) => (
      <Card
        key={chartData.date}
        title={`Budget ${chartData.date}`}
        bordered={false}
        // style={{ height: '400px' }} // Adjust the height as needed
        className='budget'
      >
        <Doughnut
          data={chartData.data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            width: 300,
            height: 300,
          }}
        />
   
      </Card>
    ))}
  </div>
);
};

const mapStateToProps = (state) => ({
  incomeData: state.income.data,
});

const mapDispatchToProps = {
  fetchIncomeData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Budget);


