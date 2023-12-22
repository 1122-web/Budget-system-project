import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { LockOutlined ,MailOutlined,EyeOutlined,EyeInvisibleOutlined} from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Card } from 'antd';
import { Link } from 'react-router-dom';

const auth = getAuth();

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem('user', JSON.stringify({ email: user.email }));
    
   
          // Navigate to the dashboard after the success toast is closed
          navigate('/DashboardTable');
        
      
    } catch (err) {
      console.error('Signin error:', err);
      toast.error('Invalid username or password', {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background:'#e4f0f0',
        
          // Set your desired background color here
        },
      });
    }
  };

  
  return (
    <div className='signup-card' style={{ textAlign: 'center' }}>
      <Card
        title="Sign In"
        bordered={false}
        style={{
          width: '100%', // Set the initial width to 100%
          maxWidth: 600,  // Limit the maximum width to 600px
          margin: '10em auto', // Center the card horizontally
        }}
      >
        <Form
          name="normal_login"
          className="login-form"
          onFinish={handleSignIn}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
                            value={email}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              onChange={(e) => setPassword(e.target.value)}
    value={password}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              onClick={handleSignIn}
              style={{ width: '30%', marginTop: '1em' }}
            >
              Sign In
            </Button>
          </Form.Item>

          <Form.Item>
            <p style={{ marginTop: '1px' }}>Not registered? <Link to="/Signup">Create an account</Link></p>
          </Form.Item>

          <Form.Item>
            <Link to="/ForgetPassword">Forgot Password</Link>
          </Form.Item>
        </Form>
      </Card>
      <ToastContainer />
    </div>
  );
};
export default SignIn;








































































































































































