import './App.css';
import LoginPage from './pages/login';
import TeamPage from './pages/team';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/game_team" component={TeamPage} />
      </Switch>
    </Router>
  );
};

export default App;