import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import { fetchIncomeData } from '../store/action';
import { getTotalExpense, getTotalSavings } from '../firebase';

import 'chart.js/auto';

import { auth ,firestore} from '../firebase';

import {  collection,query, where,   getDocs} from 'firebase/firestore';


const Budget = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incomeData, setIncomeData] = useState([]);

  

  // const fetchIncomeData = useCallback(async () => {
  //   try {
  //     const unsubscribe = auth.onAuthStateChanged((user) => {
  //       if (user) {
  //         getAndSetIncomeData(user.uid);
  //       } else {
  //         console.error("User is not signed in");
  //         setIncomeData([]);
  //       }
  //     });

  //     return () => unsubscribe();
  //   } catch (error) {
  //     console.error("Error fetching income data:", error);
  //   }
  // }, []);
  const getAndSetIncomeData = async (userId) => {
    try {
      if (userId) {
        const incomeSnapshot = await getDocs(
          query(
            collection(firestore, 'income'),
            where('uid', '==', userId)
          )
        );
  
        const incomeData = incomeSnapshot.docs.map((doc) => doc.data());
        setIncomeData(incomeData);
      } else {
        console.error("User ID is undefined");
        setIncomeData([]);
      }
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (currentUser) {
        await getAndSetIncomeData(currentUser.uid);
      } else {
        console.error('User is not signed in');
        setIncomeData([]);
      }
    } catch (error) {
      console.error('Error checking user authentication:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setIncomeData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const processAndSetData = async () => {
      try {
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
          const currentUser = auth.currentUser;
          const combinedData = await Promise.all(
            Object.values(groupedData).map(async (record) => {
              const totalExpense = await getTotalExpense(record.date,currentUser.uid);
              const totalSavings = await getTotalSavings(record.date,currentUser.uid);

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
        console.error('Error processing data:', error);
      }
    };

    processAndSetData(); // Trigger the processing when incomeData changes
  }, [incomeData, getTotalExpense, getTotalSavings]);

  return (
    <div>
      {pieChartData.map((chartData) => (
        <Card
          key={chartData.date}
          title={`Budget ${chartData.date}`}
          bordered={false}
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
