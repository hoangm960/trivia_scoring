import './App.css';
import DashboardLogin from './dashboard_login';
import GameTeam from './game_team';  
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={DashboardLogin} />
        <Route path="/game_team" component={GameTeam} />
      </Switch>
    </Router>
  );
};

export default App;