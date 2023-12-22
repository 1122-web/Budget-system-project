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
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
// import { updateIncomeData } from '../store/actions';
import { connect } from "react-redux";
import { getIncome, addIncome as addIncomeFirestore ,auth} from "../firebase"; // Import the Firestore functions
import { fetchIncomeData, updateIncomeData } from "../store/action"; // Ensure correct import paths
import { deleteIncomeRecord } from "../firebase";

import { DeleteOutlined } from "@ant-design/icons";

const Income = () => {
  // console.log('Income Data:', incomeData);

  const [tableData, setTableData] = useState([]);
  const [incomeData, setIncomeData] = useState({
    amount: 0,
    date: undefined,
  });

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const currentUser = auth.currentUser;
        const incomeFromFirestore = await getIncome(currentUser.uid);
        console.log("Fetched incomeeeeee data:", incomeFromFirestore);
        const mappedData = incomeFromFirestore.map((doc) => {
          return {
            key: doc.id,
            amount: doc.amount,
            date: doc.date ? new Date(doc.date).toISOString() : undefined,
          };
        });
        setTableData(mappedData);

        // setTableData(incomeFromFirestore);
      } catch (error) {
        console.error("Error fetching expense data from Firestore:", error);
      }
    };

    fetchIncomeData();
  }, []);

  const handleIncomeSubmit = async () => {
    try {
      const incomeDocument = {
        amount: incomeData.amount,
        date: new Date(incomeData.date).toISOString(),
      };
  
      await addIncomeFirestore(incomeDocument);
      const currentUser = auth.currentUser;
      // Fetch updated data after submission for the current user
      const updatedIncomeData = await getIncome(currentUser.uid);
  
      // Log the fetched data to inspect it
      console.log("Fetched Income Data:", updatedIncomeData);
  
      const mappedData = updatedIncomeData.map((doc) => {
        return {
          key: doc.id,
          amount: doc.amount,
          date: doc.date ? new Date(doc.date).toISOString() : undefined,
        };
      });
  
      // Set the table data
      setTableData(mappedData);
    } catch (error) {
      console.error("Error adding income to Firestore:", error.message);
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
      await deleteIncomeRecord(record.key);

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
    setIncomeData({
      ...incomeData,
      date: dateString,
    });
  };
  const handleIncomeAmountChange = (value) => {
    setIncomeData({
      ...incomeData,
      amount: value,
    });
  };

  const onFinish = () => {
    // Validate the form fields
    form
      .validateFields()
      .then(() => {
        // Log the income data to inspect it
        console.log("Income Data:", incomeData);

        // If validation succeeds, call your handleIncomeSubmit function
        handleIncomeSubmit();
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
      title: <h3>Income</h3>,
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
    },
  ];

  console.log("Table Data:", tableData);
  return (
    <div>
      <Card>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          className="div-center"
        >
          <Form.Item
            name="date"
            rules={[{ required: true, message: "Please enter your income!" }]}
            className="mobile-form-item"
          >
            <DatePicker
              onChange={handleDatePickerChange}
              className="min-width-150px"
            />
          </Form.Item>

          <Form.Item
            name="income"
            rules={[{ required: true, message: "Please enter your income!" }]}
            className="mobile-form-item"
          >
            <InputNumber
              placeholder="Income"
              onChange={handleIncomeAmountChange}
              className="min-width-150px"
            />
          </Form.Item>

          <Form.Item className="mobile-form-item">
            <Button type="primary" htmlType="submit" className="Button">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card className="w-100">
        <Table dataSource={tableData} columns={columns} size="small" className="over-flow-x"/>
      </Card>
    </div>
  );
};
// export default Income;

const mapStateToProps = (state) => ({
  incomeData: state.income.data,
});
const mapDispatchToProps = {
  updateIncomeData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Income);
