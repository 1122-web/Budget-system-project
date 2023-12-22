import React from "react";
import { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  SaveOutlined,
  DollarOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Hidden } from "react-grid-system";
import { Layout, Menu, Button, theme, Row, Col } from "antd";
import { auth } from "../firebase";

import { useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const Dashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [combinedData, setCombinedData] = useState([]);
  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("user");

    // Redirect to signup page
    window.location.href = "/signup";
  };
  useEffect(() => {
    const checkUserSession = () => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          // User is not logged in, redirect to signup
          navigate("/signup");
        }
      });

      return () => unsubscribe();
    };

    checkUserSession();
  }, [navigate]);

  // Handle initial collapsed state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768); // Adjust the threshold based on your design
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const dashboardText = () => {
    if (location.pathname === "/DashboardTable") {
      return <h3>Dashboard</h3>;
    } else if (location.pathname === "/Income") {
      return <h3>Manage Income</h3>;
    } else if (location.pathname === "/Expense") {
      return <h3>Manage Expense</h3>;
    } else if (location.pathname === "/Saving") {
      return <h3>Manage Savings</h3>;
    } else if (location.pathname === "/Budget") {
      return <h3>Budget Visualization</h3>;
    }
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={80}
        className="vh-100"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          // defaultSelectedKeys={['1']}
          style={{ marginTop: "7em" }}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/DashboardTable"),
            },
            {
              key: "2",
              icon: <DollarOutlined />,
              label: "Manage Income",
              onClick: () => navigate("/Income"),
            },
            {
              key: "3",
              icon: <SaveOutlined />,
              label: "Manage Expense",
              onClick: () => navigate("/Expense"),
            },
            {
              key: "4",
              icon: <FileDoneOutlined />,
              label: "Manage Saving",
              onClick: () => navigate("/Saving"),
            },
            {
              key: "5",
              icon: <UploadOutlined />,
              label: "Budget Visualization",
              onClick: () => navigate("/Budget"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>
          <Row justify="space-between" align="middle">
         

            <Col sm={6} md={6} lg={6} xl={6}>
              <h3
                className="title"
                style={{ textAlign: "left", flexWrap: "wrap" ,minWidth:'max-content'}}
              >
                Budget Tracker
              </h3>
            </Col>

            <Col sm={6} md={6} lg={6} xl={6}>
              <div className="header" style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  className="Button-Logout"
                  onClick={handleLogout}
                  style={{ fontSize: "12px", marginTop: 0, marginRight: 8 }}
                >
                  Logout
                </Button>
              </div>
            </Col>
          </Row>
        </Header>
        <Content>
          <h2 style={{ marginTop: 10 }}>{dashboardText()}</h2>
          <div style={{ margin: "24px", padding: "24px", minHeight: "500px" }} className="dashboard-wrapper-sm">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, { combinedData })
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
