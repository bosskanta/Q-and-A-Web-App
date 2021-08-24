import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';

import SignInUp from './SignInUp'
import Home from './Home'

const AppRoutes = () => {
  const auth = useContext(AuthContext);
  return (
    <div>
      <Switch>
        <Route exact path="/" component={auth.isAuthenticated() ? Home : SignInUp} />
        <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
