// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ViewPage from './components/ViewPage';
import EditPage from './components/EditPage';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const App = () => {
   

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        {/* Private Routes */}
        <PrivateRoute path="/view" component={ViewPage} />
        <PrivateRoute path="/edit" component={EditPage} />
      </Switch>
    </Router>
  );
};

export default App;
