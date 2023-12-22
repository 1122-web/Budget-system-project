

// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from './routes/routes';
import './App.css'
import Dashboard from './layout/Dashboard';

import React, { useEffect } from 'react';
import firebase from './firebase';
// import 'firebase/auth';

import { Provider, } from 'react-redux';
 import store from './store/store';

 const App = () => {
  // useEffect(() => {
  //   const checkUserSession = async () => {
  //     try {
  //       await firebase.auth().onAuthStateChanged((user) => {
  //         if (!user) {
  //           localStorage.removeItem('user');
  //           window.location.href = '/signup'; // Redirect to signup if no user is found
  //         } else {
  //           // Continue with user data as needed
  //           console.log('User data from local storage:', JSON.parse(localStorage.getItem('user')));
  //         }
  //       });
  //     } catch (error) {
  //       console.error('User session check error', error);
  //     }
  //   };

  //   checkUserSession();
  // }, []);
   return (
    
    <Provider store={store}>
    <Router>
      <Routes>
        {routes.map((route) => (
           <Route key={route.path} path={route.path} element={getRouteElement(route)} />
          
         ))}
      </Routes>
     </Router>
    </Provider>
 );
 };

const getRouteElement = (route) => {
 

   switch (route.layout) {
       case 'landing':
    case 'Auth':
    case 'dashboard-main':
      return <route.component  />;

    case 'dashboard':
      return (
       <Dashboard>
         <route.component  />
         </Dashboard>
      );
  default:
       return null;
  
 };
}
export default App;

// element={getRouteElement(route)}
