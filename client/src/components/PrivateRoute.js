// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Header from './Header';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
   
   debugger
    const handleLogout = () => {
        // Implement your logout logic here
        localStorage.removeItem('accessToken');

        window.location.replace('/login');
      }
      return(
        <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
          <>
     
          <Header onLogout={handleLogout} />
            <Component {...props} /></>
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      )
}
 
 
   


export default PrivateRoute;
