import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  DatePicker,
  InputNumber,
  Button,
  Table,
  Row,
  Col,
  Space,
} from "antd";
import { addExpense, getExpenses, deleteExpenseRecord ,auth} from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";

const Expense = () => {
  const [tableData, setTableData] = useState([]);
  const [expenseData, setExpenseData] = useState({
    amount: 0,
    date: null,
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const currentUser = auth.currentUser;
        const expensesFromFirestore = await getExpenses(currentUser.uid);
        console.log("Fetched expenseeeee data:", expensesFromFirestore);
        const mappedData = expensesFromFirestore.map((doc) => {
          return {
            key: doc.id,
            amount: doc.amount,
            date: doc.date ? new Date(doc.date).toISOString() : undefined,
          };
        });
        setTableData(mappedData);
        // setTableData(expensesFromFirestore);
      } catch (error) {
        console.error("Error fetching expense data from Firestore:", error);
      }
    };

    fetchExpenseData();
  }, []);

  // const handleExpenseSubmit = async () => {
  //   try {
  //     const expenseDocument = {
  //       amount: expenseData.amount,

  //       date: new Date(expenseData.date).toISOString(),
  //     };
  //     console.log("Expense Document:", expenseDocument);
  //     await addExpense(expenseDocument);

  //     // Fetch updated data after submission
  //     const updatedExpenseData = await getExpenses();
  //     console.log("Firestore Data After Adding Expense:", await getExpenses());
  //     // Log the fetched data to inspect it
  //     console.log("Fetched Expense Data:", updatedExpenseData);

  //     const mappedData = updatedExpenseData.map((doc) => {
  //       return {
  //         key: doc.id,
  //         amount: doc.amount,
  //         date: doc.date ? new Date(doc.date).toISOString() : undefined,
  //       };
  //     });
  //     console.log("Mapped Data Before Setting Table Data:", mappedData);
  //     // Set the table data
  //     setTableData(mappedData);
  //   } catch (error) {
  //     console.error("Error adding income to Firestore:", error.message);
  //   }
  // };
  const handleExpenseSubmit = async () => {
    try {
      const expenseDocument = {
        amount: expenseData.amount,
        date: new Date(expenseData.date).toISOString(),
      };
  
      await addExpense(expenseDocument);
      const currentUser = auth.currentUser;
      // Fetch updated data after submission for the current user
      const updatedExpenseData = await getExpenses(currentUser.uid);
  
      // Log the fetched data to inspect it
      console.log("Fetched Expense Data:", updatedExpenseData);
  
      const mappedData = updatedExpenseData.map((doc) => {
        return {
          key: doc.id,
          amount: doc.amount,
          date: doc.date ? new Date(doc.date).toISOString() : undefined,
        };
      });
  
      // Set the table data
      setTableData(mappedData);
    } catch (error) {
      console.error("Error adding expense to Firestore:", error.message);
    }
  };
  const handleDelete = async (record) => {
    try {
      if (!record || !record.key) {
        console.error("Invalid record:", record);
        throw new Error("Record key is undefined or missing.");
      }

      console.log("Deleting record with key:", record.key);

      // Assuming each record has an 'id' property
      await deleteExpenseRecord(record.key);

      // After successful deletion, remove the deleted record from tableData
      const updatedTableData = tableData.filter(
        (item) => item.key !== record.key
      );
      setTableData(updatedTableData);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  const handleDatePickerChange = (date, dateString) => {
    setExpenseData({
      ...expenseData,
      date: dateString,
    });
  };

  const handleExpenseAmountChange = (value) => {
    setExpenseData({
      ...expenseData,
      amount: value,
    });
  };

  const onFinish = () => {
    // Validate the form fields
    form
      .validateFields()
      .then(() => {
        // If validation succeeds, call the handleExpenseSubmit function
        handleExpenseSubmit();
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };
  const columns = [
    {
      title: <h3>Date</h3>,
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (date) {
          const formattedDate = new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          return formattedDate;
        }
        return null;
      },
    },
    {
      title: <h3>Expense</h3>,
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: <h3>Action</h3>,
      key: "action",
      render: (record) => (
        <Space>
          <Button type="danger" onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
      responsive: ["xs","sm","md","lg"], 
    },
  ];

  return (
    <div>
      <Card>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          className="div-center"
        >
          <Form.Item
            name="date"
            rules={[{ required: true, message: "Please enter date!" }]}
          >
            <DatePicker
              onChange={handleDatePickerChange}
              className="min-width-150px"
            />
          </Form.Item>
          <Form.Item
            name="Expense"
            rules={[{ required: true, message: "Please enter your expense!" }]}
          >
            <InputNumber
              placeholder="Expense"
              onChange={handleExpenseAmountChange}
              className="min-width-150px"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="Button">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table dataSource={tableData} columns={columns} size="small" className="over-flow-x"/>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Expense;
