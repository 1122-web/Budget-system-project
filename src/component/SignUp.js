import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
// import { getAuth, createUserWithEmailAndPassword ,  signInWithPopup } from "firebase/auth";
import { LockOutlined, MailOutlined,EyeOutlined,EyeInvisibleOutlined} from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Card } from 'antd';
// import { googleProvider } from '../firebase';
import { Link } from 'react-router-dom';
import { getAuth,createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { googleProvider } from '../firebase'; // Replace with your Firebase configuration

import {
 GoogleOutlined
} from '@ant-design/icons';
import { app } from '../firebase';

const auth = getAuth(app);

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const createUser = async () => {
    try {
      // Attempt to create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save user data in local storage
      localStorage.setItem('user', JSON.stringify({ email: user.email }));
  
      // If successful, show success toast and navigate
      
          navigate('/dashboardTable');
      
    
    } catch (error) {
      // Handle specific error cases
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already in use. Please use a different email or reset your password', {
          position: toast.POSITION.TOP_RIGHT,
          style: {
            background: '#e4f0f0',
          },
        });
      } else {
        // Show a generic error toast for other issues
        toast.error('Something went wrong. Please try again', {
          position: toast.POSITION.TOP_RIGHT,
          style: {
            background: '#e4f0f0',
          },
        });
      }
    }
  };
  
  const handleGoogleSignUp = async () => {
  //   try {
  //     // Sign in with Google
  //     const result = await signInWithPopup(auth, googleProvider);

  //     // Access the user information from the result
  //     const user = result.user;

  //     // You can access user.email, user.displayName, etc.
  //     console.log('Google Sign-Up Successful:', user);

  //     // Redirect or perform additional actions as needed
  //     navigate('/dashboardTable');
  //   } catch (error) {
  //     console.error('Error signing up with Google:', error.message);
  //   }
  // };

  // const onFinish = (values) => {
  //   console.log('Received values of form: ', values);
  // };
 
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);

      // Access the user information from the result
      const user = result.user;

      // You can access user.email, user.displayName, etc.
      console.log('Google Sign-Up Successful:', user);

      // Use onAuthStateChanged to listen for changes in authentication state
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // If the user is signed in, navigate to the dashboard
        if (user) {
          console.log('User is signed in:', user);
          // Redirect or perform additional actions as needed
          navigate('/dashboardTable');

          // Unsubscribe to prevent further unnecessary checks
          unsubscribe();
        }
      });
    } catch (error) {
      console.error('Error signing up with Google:', error.message);
    }
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  return (
    <>
      <div className='signup-card' style={{ textAlign: 'center' }}>
        <Card
          title="Create Account"
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
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
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
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                style={{ width: '30%', margin: '5px' }}
                onClick={createUser }
              >
                Sign Up
              </Button>
              <Button
                type="primary"
                className="login-form-button"
                icon={<GoogleOutlined />}
                style={{ width: '30%', margin: '5px' }}
                onClick={handleGoogleSignUp}
              >
                Sign Up with Google
              </Button>
            </Form.Item>

            <Form.Item>
              <p style={{ marginTop: '1px' }}>Already have an Account? <Link to="/Signin">Signin Here</Link></p>
            </Form.Item>

            <Form.Item>
              <Link to="/Forgetpassword">Forgot Password</Link>
            </Form.Item>
          </Form>
        </Card>
        <ToastContainer />
      </div>
    </>
  );
};

export default SignUp;

//   return (
//     <>
//       <div className='signup-card' style={{ textAlign: 'center' }}>
//         <Card
//           title="Create Account"
//           bordered={false}
//           style={{
//             width: 600, margin: '10em',
//           }}
//         >
//           <Form
//             name="normal_login"
//             className="login-form"
//             initialValues={{
//               remember: true,
//             }}
//             onFinish={onFinish}
//           >
//             <Form.Item
//               name="email"
//               rules={[
//                 {
//                   required: true,
//                   message: 'Please input your email!',
//                 },
//               ]}
//             >
//               <Input
//                 prefix={<MailOutlined  className="site-form-item-icon" />}
//                 type="email"
//                 placeholder="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </Form.Item>

// <Form.Item
//   name="password"
//   rules={[
//     {
//       required: true,
//       message: 'Please input your Password!',
//     },
//   ]}
// >
//   <Input.Password
//     prefix={<LockOutlined className="site-form-item-icon" />}
//     placeholder="Password"
//     onChange={(e) => setPassword(e.target.value)}
//     value={password}
//     iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)} // This line adds the eye icon
//   />
// </Form.Item>

//             <Form.Item >
//               <Button type="primary" htmlType="submit" className="login-form-button" onClick={createUser }  
//               style={{width:'30%', margin: '5px ',  }} >
          
//                 Sign Up
//               </Button>
//               <Button type="primary"
//         className="login-form-button" 
//           icon={<GoogleOutlined />}
//           onClick={handleGoogleSignUp}
//         >
//           Sign Up with Google
//         </Button>
//             </Form.Item> <Form.Item>
//         <p  style={{ marginTop:'1px'  }}>Already have an Account? <Link to="/Signin">Signin Here</Link></p>
//         </Form.Item> <Form.Item>
              

//             <Link to="/Forgetpassword" >Forgot Password</Link>
//             </Form.Item>
            
//           </Form>
//         </Card>
//         <ToastContainer />
//       </div>
//     </>
//   );
// };

// export default SignUp;
