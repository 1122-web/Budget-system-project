import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card } from 'antd';
import { app } from '../firebase';

const auth = getAuth(app);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');


  const handleForgotPassword = async () => {
    try {
        console.log('Attempting to send password reset email for:', email);
      await sendPasswordResetEmail(auth, email);
     
      toast.success('Password reset email sent successfully.', {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background:'#e4f0f0',
      
          // Set your desired background color here
        },
      });
      
    } catch (error) {
      console.error('Forgot password error:', error);

      // Show error toast
      
      toast.error('Something went wrong. Please try again.', {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background:'#e4f0f0',
   
          // Set your desired background color here
        },
      });
    
    }
  };

  return (
    <>
      <div className='forgot-password-card' style={{ textAlign: 'center' }}>
        <Card
          title="Forgot Password"
          bordered={false}
          style={{
            width: 600,
            margin: '10em',
          }}
        >
          <Form
            name="forgot_password"
            className="forgot-password-form"
            onFinish={() => handleForgotPassword()}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please enter a valid email address',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="forgot-password-form-button">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <ToastContainer />
      </div>
    </>
  );
};

export default ForgotPassword;
