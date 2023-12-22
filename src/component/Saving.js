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
import { addSavings, getSavings } from "../firebase";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import { toast, ToastContainer } from "react-toastify";
import { deleteSavingRecord } from "../firebase";

const Savings = () => {
  const [tableData, setTableData] = useState([]);
  const [savingsData, setSavingsData] = useState({
    amount: 0,
    date: null,
  });
  const [form] = Form.useForm();
  // const dispatch = useDispatch();

  useEffect(() => {
    const fetchSavingsData = async () => {
      try {
        const savingsFromFirestore = await getSavings();
        const mappedData = savingsFromFirestore.map((doc) => {
          return {
            key: doc.id,
            amount: doc.amount,
            date: doc.date ? new Date(doc.date).toISOString() : undefined,
          };
        });
        setTableData(mappedData);
      } catch (error) {
        console.error("Error fetching savings data from Firestore:", error);
      }
    };

    fetchSavingsData();
  }, []);

  const handleSavingsSubmit = async () => {
    const amount = parseFloat(savingsData.amount);
    const savingDocument = {
      amount: amount,
      date: savingsData.date ? new Date(savingsData.date).toISOString() : null,
    };
    await addSavings(savingDocument);

    const updatedSavingData = await getSavings();

    // Map the data for table display
    const mappedData = updatedSavingData.map((doc) => ({
      key: doc.id,
      amount: doc.amount,
      date: doc.date instanceof Date ? doc.date.toISOString() : doc.date,
    }));

    // Update the table data
    setTableData(mappedData);
  };

  const handleDelete = async (record) => {
    try {
      if (!record || !record.key) {
        console.error("Invalid record:", record);
        throw new Error("Record key is undefined or missing.");
      }

      console.log("Deleting record with key:", record.key);

      // Assuming each record has an 'id' property
      await deleteSavingRecord(record.key);

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
    setSavingsData({
      ...savingsData,
      date: dateString,
    });
  };

  const handleSavingsAmountChange = (value) => {
    setSavingsData({
      ...savingsData,
      amount: value,
    });
  };

  const onFinish = () => {
    form
      .validateFields()
      .then(() => {
        handleSavingsSubmit();
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
      title: <h3>Saving</h3>,
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
            name="Savings"
            rules={[{ required: true, message: "Please enter your savings!" }]}
          >
            <InputNumber
              placeholder="Savings"
              onChange={handleSavingsAmountChange}
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
        <Table
          dataSource={tableData}
          columns={columns}
          size="small"
          className="over-flow-x"
        />
      </Card>

      <ToastContainer />
    </div>
  );
};

export default Savings;
